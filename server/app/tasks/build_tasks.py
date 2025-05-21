from app.models import Build, User
from app.extensions import db
from app.services.github_service import get_repo_code
from app.services.build_service import extract_walrus_deployment_info
from app.tasks import celery
import subprocess, os, shutil

@celery.task()
def run_build(build_id):
    build = Build.query.get(build_id)
    user = User.query.get(build.user_id)

    tmp_dir = f"/tmp/{build.id}"
    os.makedirs(tmp_dir, exist_ok=True)

    try:
        #add statuses across steps
        # Clone
        build.status = 'cloning'
        db.session.commit()
        get_repo_code(build.repo_url, build.branch, tmp_dir)
        build.status = 'building'
        db.session.commit()
        #Install
        result = subprocess.run(['npm', 'install'], cwd=tmp_dir, capture_output=True, text=True)
        build.log = (build.log or "") + result.stdout + result.stderr
        build.status = 'installed' if result.returncode == 0 else 'failed'
        db.session.commit()
        #Build
        result = subprocess.run(build.build_command.split(), cwd=tmp_dir, capture_output=True, text=True)
        build.log = (build.log or "") + result.stdout + result.stderr
        build.status = 'build success' if result.returncode == 0 else 'failed'
        db.session.commit()
        #Deploy
        result = subprocess.run(" ".join(['export', 'PATH="$HOME/.local/bin/:$PATH"', "&&", 'site-builder', 'publish', f'.{build.output_dir}', '--epochs', '1']), cwd=tmp_dir, capture_output=True, text=True, shell=True)
        
        if result.returncode == 0:
            output = result.stdout + result.stderr
            build.log = (build.log or "") + output
            db.session.commit()
            walrus_info = extract_walrus_deployment_info(output)
            if walrus_info:
                build.app_url, build.site_object_id = walrus_info
                build.log = (build.log or "") + f"Deployed Walrus site, to access your app: {result.stdout}\n" + f"The site object ID: {result.stderr}"
                db.session.commit()

        # build.log = (build.log or "") + result.stdout + result.stderr
        build.status = 'deployed' if result.returncode == 0 else 'failed'
        db.session.commit()
    except Exception as e:
        build.status = 'failed'
        build.log = str(e)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        db.session.commit()
