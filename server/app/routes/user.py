from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Build

bp = Blueprint("user", __name__, url_prefix="/api/user")

@bp.route('')
@jwt_required()
def profile():
    user = User.query.get(get_jwt_identity())
    return {
        "walletAddress": user.wallet_address,
        "githubUsername": user.github_username
    }

@bp.route('/projects')
@jwt_required()
def projects():
    user_id = get_jwt_identity()
    builds = Build.query.filter_by(user_id=user_id).all()
    return [dict(
        id=b.id,
        repoName=b.repo_url,
        branch=b.branch,
        status=b.status
    ) for b in builds]
