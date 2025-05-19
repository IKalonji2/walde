from app.models import Build, User
from app.extensions import db
from app.services.github_service import get_repo_code
from app.tasks import celery
import subprocess, os, shutil

@celery.task()
def run_build(build_id):
    build = Build.query.get(build_id)
    user = User.query.get(build.user_id)

    tmp_dir = f"/tmp/{build.id}"
    os.makedirs(tmp_dir, exist_ok=True)

    try:
        get_repo_code(build.repo_url, build.branch, tmp_dir)
        build.status = 'building'
        db.session.commit()

        result = subprocess.run(build.build_command.split(), cwd=tmp_dir, capture_output=True, text=True)
        build.log = result.stdout + result.stderr
        build.status = 'success' if result.returncode == 0 else 'failed'
    except Exception as e:
        build.status = 'failed'
        build.log = str(e)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        db.session.commit()
