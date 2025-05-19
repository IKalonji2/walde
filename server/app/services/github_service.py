import requests
import subprocess
import os
from app.models import User
from app.services.encryption import decrypt_token

def get_user_github_repos(user: User):
    if not user.encrypted_github_token:
        raise Exception("GitHub account not connected.")
    token = decrypt_token(user.encrypted_github_token)
    res = requests.get(
        "https://api.github.com/user/repos",
        headers={"Authorization": f"token {token}"}
    )
    if res.status_code != 200:
        raise Exception("Failed to fetch repositories.")
    return res.json()

def get_repo_code(repo_url: str, branch: str, target_dir: str):
    subprocess.run([
        "git", "clone", "--branch", branch, "--depth", "1", repo_url, target_dir
    ], check=True)

def register_github_webhook(user: User, repo_full_name: str):
    token = decrypt_token(user.encrypted_github_token)
    url = f"https://api.github.com/repos/{repo_full_name}/hooks"

    secret = os.getenv("GITHUB_WEBHOOK_SECRET")
    payload = {
        "name": "web",
        "active": True,
        "events": ["push"],
        "config": {
            "url": os.getenv("WEBHOOK_URL", "http://localhost:5000/api/github/webhook"),
            "content_type": "json",
            "secret": secret,
            "insecure_ssl": "0"
        }
    }

    res = requests.post(
        url,
        json=payload,
        headers={"Authorization": f"token {token}", "Accept": "application/vnd.github.v3+json"}
    )

    if res.status_code >= 300:
        raise Exception(f"Failed to register webhook: {res.text}")
