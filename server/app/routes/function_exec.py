import subprocess
from flask import Blueprint, request, jsonify
from app.models import Function
import requests
import tempfile
import os

bp = Blueprint("fn_exec", __name__, url_prefix="/functions")

@bp.route("/<function_id>/invoke", methods=["POST"])
def invoke_function(function_id):
    fn = Function.query.get(function_id)
    if not fn:
        return {"error": "Function not found"}, 404

    # Temp file & folder
    with tempfile.TemporaryDirectory() as tmpdir:
        code_path = os.path.join(tmpdir, "function.py")
        try:
            # Fetch code from Walrus blob ID
            subprocess.run(
                ["walrus", "read", fn.blob_id, "--out", code_path],
                check=True,
                capture_output=True,
                text=True
            )

            # Read code from temp file
            with open(code_path, "r") as f:
                code = f.read()

            namespace = {}
            exec(code, namespace)

            input_data = request.json.get("input")
            result = namespace["run"](input_data)

            return jsonify({"result": result})

        except subprocess.CalledProcessError as e:
            return {"error": f"Failed to read from Walrus: {e.stderr}"}, 500
        except Exception as ex:
            return {"error": str(ex)}, 500
