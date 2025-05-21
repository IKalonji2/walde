import subprocess
from flask import Blueprint, request, jsonify
from app.models import Function
import requests

bp = Blueprint("fn_exec", __name__, url_prefix="/functions")

@bp.route("/<function_id>/invoke", methods=["POST"])
def invoke_function(function_id):
    fn = Function.query.get(function_id)
    if not fn:
        return {"error": "Function not found"}, 404

    # Retrieve latest code from Walrus
    code = fn.code
    input_data = request.json.get("input")

    try:
        result = subprocess.run(
                ["walrus", "read", f"{fn.slug}"],
                capture_output=True,
                text=True
            )
        output = result.stdout + result.stderr
        # sandboxed execution
        namespace = {}
        exec(code, namespace)
        result = namespace["run"](input_data)
        return jsonify({"result": result})
    except Exception as e:
        return {"error": str(e)}, 500
