from flask import Blueprint, request, jsonify
from app.models import User
from app.extensions import db
from flask_jwt_extended import create_access_token

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@bp.route('/wallet-login', methods=['POST'])
def wallet_login():
    wallet_address = request.json.get("wallet_address")
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        user = User(wallet_address=wallet_address)
        db.session.add(user)
        db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify(access_token=token)
