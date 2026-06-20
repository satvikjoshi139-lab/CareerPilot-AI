# CareerPilot AI package initialization
import os
from pathlib import Path
from dotenv import load_dotenv

def _load_env():
    """
    Load .env from the most specific location found, walking up from:
      1. The directory this file lives in  (package root)
      2. The caller's current working directory
      3. Two levels above the package (project root when installed in editable mode)
    """
    candidates = [
        Path(__file__).parent / ".env",          # careerpilot_ai/.env  (root .env)
        Path.cwd() / ".env",                      # wherever the user runs from
        Path(__file__).parent.parent / ".env",    # one level above package
        Path(__file__).parent.parent.parent / ".env",  # two levels above (pip install -e .)
    ]
    for path in candidates:
        if path.is_file():
            load_dotenv(dotenv_path=path, override=False)
            break
    else:
        # Fallback: let python-dotenv search upward from cwd
        load_dotenv(override=False)

_load_env()
