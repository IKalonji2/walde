import re
from typing import Optional, Tuple

def extract_walrus_deployment_info(shell_output: str) -> Optional[Tuple[str, str]]:
    """
    Extracts the portal slug and site object ID from Walrus output.
    Returns (url, site_object_id) or None if not found.
    """

    # Match URL: http://<slug>.localhost:3000
    slug_match = re.search(r"http://([a-z0-9]+)\.localhost:3000", shell_output, re.IGNORECASE)

    # Match Site Object ID: 0x....
    obj_id_match = re.search(r"New site object ID:\s*(0x[a-fA-F0-9]+)", shell_output)

    if not slug_match:
        print("[Parser] Failed to find Walrus URL slug")
    if not obj_id_match:
        print("[Parser] Failed to find Walrus site object ID")

    if slug_match and obj_id_match:
        slug = slug_match.group(1)
        obj_id = obj_id_match.group(1)
        final_url = f"https://{slug}.walde.cloud"
        return final_url, obj_id

    return None
