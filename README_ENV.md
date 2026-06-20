# CareerPilot AI — Environment Setup

## Step 1 — Install Python dependencies
```powershell
pip install -r requirements.txt
```

## Step 2 — Verify your .env is being loaded

```powershell
python load_env.py
```

Expected output:
```
[load_env] Loaded: C:\...\CareerPilot_AI\.env
[load_env] GEMINI_API_KEY loaded successfully ✓  (starts with: AQ.Ab8RN...)
```

## Step 3 — Use in your own scripts

```python
import load_env          # must be first — loads .env into os.environ
import os

key = os.getenv("GEMINI_API_KEY")
print("Key:", key)
```

Or the one-liner quick check:
```powershell
python -c "import load_env; import os; print('Key loaded?', bool(os.getenv('GEMINI_API_KEY')))"
```

## Step 4 — Run the frontend

```powershell
npm install
npm run dev
```

## Why the original `python -c "import os; print(...)"` returned False

`os.getenv()` only sees variables that are already in the OS environment.
The `.env` file is **not** loaded automatically by Python — you must call
`load_dotenv()` first (which `load_env.py` does for you).

Running `python -c "import os; ..."` with no `load_dotenv()` call will
always return `False`, no matter what is in your `.env`.

## .env file location

The `.env` file must be in the same folder as `load_env.py`:
```
CareerPilot_AI/
├── .env                 ← your API key goes here
├── load_env.py          ← run this to verify
├── requirements.txt
├── package.json
└── src/
```

## .env format (no quotes!)
```
GEMINI_API_KEY=your_actual_key_here
```
///latest commands

Terminal 1: Start the Python MCP Server Backend
Ensure you are in the project root directory (CareerPilot_AI_v4) and run:

powershell
# 1. Install/verify Python dependencies
pip install -r requirements.txt
# 2. Run the MCP server
python career_resource_mcp.py
This starts the backend on http://127.0.0.1:8000.

Terminal 2: Start the React Frontend
Open a new terminal window in VS Code, navigate to the project root directory, and run:

powershell
# 1. Install Node dependencies
npm install
# 2. Start the Vite development server
npm run dev
This starts the frontend, which will be accessible at the address printed in the terminal (typically http://localhost:5173).

Once both are running, the frontend will automatically detect the MCP server, and you will see the status badge change to CareerResourceMCP: Active on the Agent Workflow page.

