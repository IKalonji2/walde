from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Function, db
from app.services.function_service import deploy_function_to_walrus
import uuid

bp = Blueprint("functions", __name__, url_prefix="/api/functions")

@bp.route("", methods=["POST"])
@jwt_required()
def create_function():
    user_id = get_jwt_identity()
    data = request.json

    code = data.get("code", "")
    if "def run(" not in code:
        return {"error": "Your function must contain a `run(input)` definition."}, 400

    slug, object_id = deploy_function_to_walrus(code)

    fn = Function(
        user_id=user_id,
        name=data.get("name"),
        description=data.get("description", ""),
        code=code,
        slug=slug,
        walrus_object_id=object_id
    )

    db.session.add(fn)
    db.session.commit()

    return {
        "id": fn.id,
        "url": f"https://{slug}.walde.cloud/functions/{fn.id}"
    }

@bp.route("", methods=["GET"])
@jwt_required()
def list_functions():
    user_id = get_jwt_identity()
    fns = Function.query.filter_by(user_id=user_id).all()
    return [{
        "id": fn.id,
        "name": fn.name,
        "description": fn.description,
        "url": f"https://{fn.slug}.walde.cloud/functions/{fn.id}",
        "createdAt": fn.created_at.isoformat()
    } for fn in fns]
