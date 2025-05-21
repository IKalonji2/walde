from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Build, User
from app.extensions import db
from app.tasks.build_tasks import run_build
from app.services.github_service import register_github_webhook

bp = Blueprint("build", __name__, url_prefix="/api/build")

@bp.route('', methods=['POST'])
@jwt_required()
def create_build():
    data = request.json
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    build = Build(
        user_id=user_id,
        app_name=data['name'],
        repo_url=data['repo'],
        branch=data.get('branch', 'main'),
        output_dir=data.get('output_dir', '/dist'),
        build_command=data.get('build_command', 'npm run build'),
        auto_deploy=data.get('auto_deploy', True),
        status='queued'
    )
    db.session.add(build)
    db.session.commit()

    run_build.delay(build.id)

    try:
        repo_full_name = data['repo'].replace('https://github.com/', '').replace('.git', '')
        register_github_webhook(user, repo_full_name)
    except Exception as e:
        print(f"⚠️ Webhook registration failed: {e}")

    return jsonify(build_id=build.id)

@bp.route('/<build_id>')
@jwt_required()
def get_build(build_id):
    build = Build.query.get(build_id)
    return {
        "appName": build.app_name,
        "repoUrl": build.repo_url,
        "appUrl": build.app_url,
        "branch": build.branch,
        "status": build.status,
        "outputDir": build.output_dir,
        "log": build.log,
        "siteObjectId": build.site_object_id
    }

@bp.route('/<build_id>/rebuild', methods=['POST'])
@jwt_required()
def rebuild(build_id):
    build = Build.query.get(build_id)

    if not build or build.user_id != get_jwt_identity():
        return {"error": "Unauthorized or not found"}, 404

    # Reset status and clear log
    build.status = 'queued'
    build.log = ''
    db.session.commit()

    from app.tasks.build_tasks import run_build
    run_build.delay(build.id)

    return {"msg": "Rebuild started"}

