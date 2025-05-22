import re
import subprocess
import os
import uuid
from typing import Tuple

def deploy_function_to_walrus(code: str) -> Tuple[str, str]:
    """
    Stores the function as `function.py`, deploys to Walrus, and returns (slug, object_id)
    """
    tmp_id = str(uuid.uuid4())
    tmp_path = f"/tmp/{tmp_id}"
    os.makedirs(tmp_path, exist_ok=True)

    code_path = os.path.join(tmp_path, "function.py")
    with open(code_path, "w") as f:
        f.write(code)

    try:
        result = subprocess.run(
            ["walrus", "store", tmp_path, "--epochs", "1"],
            capture_output=True,
            text=True
        )
        output = result.stdout + result.stderr
        slug, object_id = extract_walrus_function_info(output)
        return slug, object_id
    finally:
        import shutil
        shutil.rmtree(tmp_path, ignore_errors=True)

def extract_walrus_function_info(output: str) -> Tuple[str, str]:
    blob_id_match = re.search(r"Blob ID:\s*([a-zA-Z0-9_-]+)", output)
    obj_id_match = re.search(r"Sui object ID:\s*(0x[a-fA-F0-9]+)", output)
    
    if not blob_id_match or not obj_id_match:
        raise ValueError("Failed to extract Walrus info")

    blob_id = blob_id_match.group(1)
    object_id = obj_id_match.group(1)
    return blob_id, object_id
