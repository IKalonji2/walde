from flask import Blueprint, request, redirect, abort, jsonify
import os, requests
from app.extensions import db
from app.models import User
from app.services.encryption import encrypt_token
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
import hmac
import hashlib
from dotenv import load_dotenv
from app.services.github_service import get_user_github_repos
from app.models import User, Build

load_dotenv()


bp = Blueprint("github", __name__, url_prefix="/api/github")

@bp.route('/login')
def login():
    jwt_token = request.args.get("token")
    return redirect(f"https://github.com/login/oauth/authorize?client_id={os.getenv('GITHUB_CLIENT_ID')}&scope=repo&state={jwt_token}")

@bp.route('/callback')
def callback():
    code = request.args.get('code')
    jwt_token = request.args.get('state')

    if not jwt_token:
        return jsonify({"msg": "Missing state (token)"}), 400

    try:
        decoded_token = decode_token(jwt_token)
        user_id = decoded_token.get('sub')
        if not user_id:
            raise Exception("Missing subject")
    except Exception as e:
        return jsonify({"msg": f"Invalid token: {str(e)}"}), 401

    # Exchange code for GitHub token
    token_res = requests.post(
        'https://github.com/login/oauth/access_token',
        data={
            'client_id': os.getenv('GITHUB_CLIENT_ID'),
            'client_secret': os.getenv('GITHUB_CLIENT_SECRET'),
            'code': code
        },
        headers={'Accept': 'application/json'}
    )

    access_token = token_res.json().get('access_token')
    if not access_token:
        return jsonify({"msg": "GitHub access denied"}), 400

    user_data = requests.get('https://api.github.com/user', headers={
        'Authorization': f'token {access_token}'
    }).json()

    user = User.query.get(user_id)
    user.github_username = user_data.get('login')
    user.encrypted_github_token = encrypt_token(access_token)
    db.session.commit()

    return redirect(os.getenv('CALLBACK_URL'))

@bp.route('/webhook', methods=['POST'])
def github_webhook():
    # Optional: verify signature
    signature = request.headers.get('X-Hub-Signature-256')
    payload = request.get_data()

    secret = os.getenv('GITHUB_WEBHOOK_SECRET')
    if secret:
        expected_signature = 'sha256=' + hmac.new(
            secret.encode(), msg=payload, digestmod=hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(signature or '', expected_signature):
            abort(403)

    event = request.headers.get('X-GitHub-Event')
    if event != 'push':
        return jsonify({'msg': 'Ignored'}), 200

    data = request.json
    repo_url = data['repository']['clone_url']
    branch = data['ref'].split('/')[-1]

    # Find matching auto-deploy builds
    builds = Build.query.filter_by(repo_url=repo_url, branch=branch, auto_deploy=True).all()

    if not builds:
        return jsonify({'msg': 'No auto-deploy builds'}), 200

    for b in builds:
        b.status = 'queued'
        b.log = ''
        db.session.commit()
        run_build.delay(b.id)

    return jsonify({'msg': f'Deploy triggered for {len(builds)} builds'}), 200

@bp.route('/repos')
@jwt_required()
def list_repos():
    user = User.query.get(get_jwt_identity())
    try:
        repos = get_user_github_repos(user)
        return [
            {"full_name": r["full_name"], "clone_url": r["clone_url"]}
            for r in repos
        ]
    except Exception as e:
        return {"error": str(e)}, 400
