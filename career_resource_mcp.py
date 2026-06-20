import os
import json
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mcp.server.fastmcp import FastMCP
import uvicorn

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("CareerResourceMCP")

# Load environment variables
import load_env

# Configure Gemini API if key is available
import google.generativeai as genai
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API configured successfully for MCP tools.")
else:
    logger.warning("GEMINI_API_KEY not found. MCP tools will use fallback data.")

# Initialize FastMCP server
mcp = FastMCP("CareerResourceMCP")

# Predefined fallback databases
FALLBACK_RESOURCES = {
    "java": [
        {"name": "Oracle Java Tutorials", "type": "Documentation", "url": "https://docs.oracle.com/javase/tutorial/"},
        {"name": "Baeldung Java Guides", "type": "Tutorial", "url": "https://www.baeldung.com/"},
        {"name": "Java Programming (MOOC.fi)", "type": "Course", "url": "https://java-programming.mooc.fi/"}
    ],
    "react": [
        {"name": "React Dev Official Documentation", "type": "Documentation", "url": "https://react.dev/"},
        {"name": "Scrimba Learn React for Free", "type": "Course", "url": "https://scrimba.com/learn/learnreact"},
        {"name": "React Hooks Guide - Kent C. Dodds", "type": "Tutorial", "url": "https://epicreact.dev/"}
    ],
    "mysql": [
        {"name": "MySQL Tutorial", "type": "Tutorial", "url": "https://www.mysqltutorial.org/"},
        {"name": "W3Schools SQL Tutorial", "type": "Tutorial", "url": "https://www.w3schools.com/sql/"},
        {"name": "High Performance MySQL (Book)", "type": "Documentation", "url": "https://www.oreilly.com/"}
    ]
}

FALLBACK_PROJECTS = {
    "java": [
        {"title": "Library Catalog System", "description": "Command-line app to catalog library books, track checkout statuses, and manage members.", "difficulty": "Beginner"},
        {"title": "Spring Boot REST Backend", "description": "Create a fully tested CRUD application for user accounts with secure JWT authentication.", "difficulty": "Intermediate"}
    ],
    "react": [
        {"title": "Personal Finance Tracker", "description": "Single Page Application with dashboard widgets, monthly budget planning, and charts.", "difficulty": "Intermediate"},
        {"title": "Collaborative Kanban Board", "description": "Drag-and-drop workspace with column updates and task tags.", "difficulty": "Advanced"}
    ]
}

FALLBACK_TOPICS = {
    "sde-1": [
        "Data Structures and Algorithms (Complexity, HashMaps, Trees, Graphs)",
        "Object-Oriented Programming (Inheritance, Polymorphism, SOLID principles)",
        "SQL Query Optimization and Joins",
        "REST API Design and HTTP Methods"
    ],
    "frontend engineer": [
        "Modern CSS Layouts (Flexbox, Grid, Responsive Design)",
        "JavaScript Core (Closures, Event Loop, Promises, Async/Await)",
        "React Component Lifecycle, Virtual DOM, and Hooks",
        "Browser Optimization (Lazy loading, bundle size, cache controls)"
    ]
}

def clean_json_response(raw_text: str) -> str:
    """Helper to clean markdown formatting from LLM JSON responses."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()

@mcp.tool()
def get_learning_resources(skill: str) -> str:
    """Get high-quality learning resources (courses, documentation, tutorials) for a specific skill.

    Args:
        skill: The skill to get resources for (e.g., 'Java', 'React', 'MySQL').
    """
    skill_key = skill.strip().lower()
    logger.info(f"Tool get_learning_resources invoked for skill: {skill}")

    # Try Gemini generation if available
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            prompt = (
                f"Provide a JSON list of 3 top learning resources for the skill '{skill}'. "
                "Each resource must have 'name', 'type' (e.g., Documentation, Course, Tutorial), and 'url'. "
                "Return ONLY the raw JSON array. No markdown code blocks, no explanations, no prefix/suffix."
            )
            response = model.generate_content(prompt)
            json_str = clean_json_response(response.text)
            # Verify valid JSON
            json.loads(json_str)
            return json_str
        except Exception as e:
            logger.error(f"Gemini generation failed for resources of {skill}: {e}")

    # Fallback response
    if skill_key in FALLBACK_RESOURCES:
        return json.dumps(FALLBACK_RESOURCES[skill_key], indent=2)

    # General fallback
    general_fallback = [
        {"name": f"Official {skill} Documentation", "type": "Documentation", "url": f"https://www.google.com/search?q={skill}+official+documentation"},
        {"name": f"Learn {skill} on YouTube", "type": "Tutorial", "url": f"https://www.youtube.com/results?search_query=learn+{skill}"}
    ]
    return json.dumps(general_fallback, indent=2)


@mcp.tool()
def get_project_templates(skill: str) -> str:
    """Get portfolio project ideas/templates for a specific skill.

    Args:
        skill: The skill to recommend project templates for (e.g., 'Java', 'React', 'MySQL').
    """
    skill_key = skill.strip().lower()
    logger.info(f"Tool get_project_templates invoked for skill: {skill}")

    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            prompt = (
                f"Provide a JSON list of 2 portfolio project templates for the skill '{skill}'. "
                "Each project must have 'title', 'description', and 'difficulty' (Beginner, Intermediate, or Advanced). "
                "Return ONLY the raw JSON array. No markdown code blocks, no explanations, no prefix/suffix."
            )
            response = model.generate_content(prompt)
            json_str = clean_json_response(response.text)
            # Verify valid JSON
            json.loads(json_str)
            return json_str
        except Exception as e:
            logger.error(f"Gemini generation failed for project templates of {skill}: {e}")

    # Fallback response
    if skill_key in FALLBACK_PROJECTS:
        return json.dumps(FALLBACK_PROJECTS[skill_key], indent=2)

    # General fallback
    general_fallback = [
        {"title": f"{skill} Portfolio Application", "description": f"Build a comprehensive portfolio application utilizing core concepts of {skill}.", "difficulty": "Intermediate"}
    ]
    return json.dumps(general_fallback, indent=2)


@mcp.tool()
def get_interview_topics(role: str) -> str:
    """Get key interview topics and concepts related to a specific job role.

    Args:
        role: The job role (e.g., 'SDE-1', 'Frontend Engineer', 'Fullstack Developer').
    """
    role_key = role.strip().lower()
    logger.info(f"Tool get_interview_topics invoked for role: {role}")

    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            prompt = (
                f"Provide a JSON list of 4 key interview topics or questions for the role '{role}'. "
                "Each item must be a string. "
                "Return ONLY the raw JSON array of strings. No markdown code blocks, no explanations, no prefix/suffix."
            )
            response = model.generate_content(prompt)
            json_str = clean_json_response(response.text)
            # Verify valid JSON
            json.loads(json_str)
            return json_str
        except Exception as e:
            logger.error(f"Gemini generation failed for interview topics of {role}: {e}")

    # Fallback response
    # Search for role matching
    for key, val in FALLBACK_TOPICS.items():
        if key in role_key or role_key in key:
            return json.dumps(val, indent=2)

    # General fallback
    general_fallback = [
        "Core Programming Constructs",
        "Problem Solving & Algorithms",
        "System Architecture & Best Practices",
        "Behavioral and Team Scenarios"
    ]
    return json.dumps(general_fallback, indent=2)


# Initialize FastAPI app
app = FastAPI(title="CareerResourceMCP Bridge Server")

# Allow CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST helper endpoints for easy client fetching from the React UI
@app.get("/tools/get_learning_resources")
def api_learning_resources(skill: str):
    try:
        data = get_learning_resources(skill)
        return json.loads(data)
    except Exception as e:
        return {"error": str(e)}

@app.get("/tools/get_project_templates")
def api_project_templates(skill: str):
    try:
        data = get_project_templates(skill)
        return json.loads(data)
    except Exception as e:
        return {"error": str(e)}

@app.get("/tools/get_interview_topics")
def api_interview_topics(role: str):
    try:
        data = get_interview_topics(role)
        return json.loads(data)
    except Exception as e:
        return {"error": str(e)}

# Mount the MCP server's HTTP transport app
try:
    mcp_app = mcp.streamable_http_app()
    app.mount("/mcp", mcp_app)
    logger.info("Mounted CareerResourceMCP streamable HTTP sub-application on /mcp")
except Exception as err:
    logger.error(f"Failed to mount streamable HTTP app: {err}")

if __name__ == "__main__":
    port = 8000
    logger.info(f"Launching CareerResourceMCP FastAPI server at http://127.0.0.1:{port}")
    uvicorn.run(app, host="127.0.0.1", port=port)
