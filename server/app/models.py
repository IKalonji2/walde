from .extensions import db
from datetime import datetime
import uuid

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(128), unique=True, nullable=False)
    github_username = db.Column(db.String(128))
    encrypted_github_token = db.Column(db.Text)

class Build(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    app_name = db.Column(db.String(128))
    repo_url = db.Column(db.String(255))
    branch = db.Column(db.String(64), default='main')
    build_command = db.Column(db.String(255))
    output_dir = db.Column(db.String(255))
    status = db.Column(db.String(32), default='pending')
    log = db.Column(db.Text)
    app_url = db.Column(db.String(255))
    auto_deploy = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    site_object_id = db.Column(db.String(128))

class Function(db.Model):
    __tablename__ = "function"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    code = db.Column(db.Text, nullable=False)
    walrus_object_id = db.Column(db.String(128))
    blod_id = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
