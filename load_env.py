"""
CareerPilot AI — standalone env loader.

Run this directly to verify your .env is working:
    python load_env.py

Or import it at the top of any script before using os.getenv():
    import load_env
    import os
    key = os.getenv("GEMINI_API_KEY")
"""
import os
import sys
from pathlib import Path

def load():
    try:
        from dotenv import load_dotenv
    except ImportError:
        print("[load_env] ERROR: python-dotenv not installed.")
        print("           Run: pip install python-dotenv")
        sys.exit(1)

    # Search for .env starting from this file's directory, then walk up to root
    start = Path(__file__).resolve().parent
    for directory in [start, *start.parents]:
        candidate = directory / ".env"
        if candidate.is_file():
            load_dotenv(dotenv_path=candidate, override=True)
            print(f"[load_env] Loaded: {candidate}")
            return str(candidate)

    print("[load_env] WARNING: No .env file found anywhere in directory tree.")
    print(f"           Searched from: {start}")
    return None

# Auto-run when imported or executed directly
_found = load()

if __name__ == "__main__":
    key = os.getenv("GEMINI_API_KEY")
    if key:
        print(f"[load_env] GEMINI_API_KEY loaded successfully ✓  (starts with: {key[:8]}...)")
    else:
        print("[load_env] GEMINI_API_KEY is NOT set ✗")
        print("           Make sure your .env file contains: GEMINI_API_KEY=your_key_here")
