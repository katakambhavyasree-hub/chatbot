"""
College Query Chatbot Backend - Python Flask
Grounded Campus Question Answering with Google Gemini API
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for local Vite development (usually http://localhost:5173 or http://localhost:3000)
CORS(app)

# Load College Knowledge Base
DATA_PATH = os.path.join(os.path.dirname(__file__), "college_data.json")

def load_college_data():
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading college_data.json: {e}")
        return {}

college_data = load_college_data()

# Gemini Client setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Google GenAI SDK: {e}")

FALLBACK_MESSAGE = (
    "Sorry, I couldn't find this information in the available college records. "
    "Please contact the college office for confirmation."
)

def extract_relevant_context(user_query: str, data: dict) -> dict:
    """
    Selects relevant parts of the knowledge base to keep the prompt focused.
    """
    query_lower = user_query.lower()
    relevant = {
        "institution": data.get("institution", {})
    }

    # Keyword routing
    if any(k in query_lower for k in ["admit", "admission", "eligib", "apply", "form", "entrance", "cet", "jee", "seat", "date", "quota"]):
        relevant["admissions"] = data.get("admissions", {})
        relevant["courses"] = data.get("courses", [])

    if any(k in query_lower for k in ["fee", "tuition", "cost", "pay", "charge", "refund", "deposit", "installment"]):
        relevant["fee_structure"] = data.get("fee_structure", {})
        relevant["scholarships"] = data.get("scholarships", [])

    if any(k in query_lower for k in ["course", "department", "branch", "b.tech", "btech", "m.tech", "mba", "curriculum", "syllabus", "subject"]):
        relevant["courses"] = data.get("courses", [])
        relevant["faculty"] = data.get("faculty", {})

    if any(k in query_lower for k in ["faculty", "prof", "teacher", "hod", "head", "dean", "ratio"]):
        relevant["faculty"] = data.get("faculty", {})

    if any(k in query_lower for k in ["exam", "grading", "grade", "cgpa", "sgpa", "backlog", "attendance", "fail", "pass", "revaluation", "schedule"]):
        relevant["examinations_and_academics"] = data.get("examinations_and_academics", {})

    if any(k in query_lower for k in ["place", "placement", "package", "salary", "lpa", "recruit", "company", "intern", "internship"]):
        relevant["placements_and_internships"] = data.get("placements_and_internships", {})

    if any(k in query_lower for k in ["scholarship", "financial aid", "waiver", "concession", "grant"]):
        relevant["scholarships"] = data.get("scholarships", [])

    if any(k in query_lower for k in ["hostel", "room", "mess", "food", "bus", "transport", "library", "lab", "gym", "sport", "hospital", "clinic", "curfew", "facility", "facilities"]):
        relevant["facilities"] = data.get("facilities", {})

    if any(k in query_lower for k in ["contact", "phone", "email", "address", "number", "location", "office", "helpline", "website", "link"]):
        relevant["contacts_and_directory"] = data.get("contacts_and_directory", {})

    # If no specific keyword triggered or broad query, include the full data
    if len(relevant) == 1:
        return data

    # Always ensure contacts are included for office escalation
    if "contacts_and_directory" not in relevant:
        relevant["contacts_and_directory"] = data.get("contacts_and_directory", {})

    return relevant

@app.route("/api/college-data", methods=["GET"])
def get_college_data():
    """Returns the current college information."""
    return jsonify(college_data)

@app.route("/api/chat", methods=["POST"])
def chat():
    """Handles conversational questions from students."""
    body = request.get_json(silent=True) or {}
    user_query = body.get("message", "").strip()

    if not user_query:
        return jsonify({"error": "Message cannot be empty."}), 400

    # Retrieve relevant college records slice
    matched_data = extract_relevant_context(user_query, college_data)
    college_name = college_data.get("institution", {}).get("name", "our college")

    # If Gemini API is configured, ask Gemini with strict instructions
    if client:
        try:
            system_prompt = (
                f"You are the official Campus Query Assistant for {college_name}. "
                "Your role is to assist students, applicants, and parents by answering questions "
                "strictly and exclusively using the verified college records supplied below.\n\n"
                "STRICT INSTITUTIONAL RULES:\n"
                f"1. If the exact answer or specific policy is NOT found in the provided college records, you MUST state: \"{FALLBACK_MESSAGE}\"\n"
                "2. NEVER invent, extrapolate, or guess fee amounts, dates, cutoffs, admission rules, faculty names, or college policies.\n"
                "3. Present figures (fees, package LPA, attendance %) accurately using clean bullet points and bold highlights.\n"
                "4. When relevant, reference official contact numbers, office locations, and links provided in the records.\n"
                "5. Maintain a professional, polite, and encouraging academic tone.\n\n"
                "OFFICIAL COLLEGE RECORDS:\n"
                f"{json.dumps(matched_data, indent=2)}"
            )

            response = client.models.generateContent(
                model="gemini-3.8-flash",
                contents=f"{system_prompt}\n\nStudent Question: {user_query}",
            )

            raw_answer = response.text if response.text else FALLBACK_MESSAGE
            clean_answer = raw_answer.strip(' "\'“”‘’')
            return jsonify({
                "answer": clean_answer,
                "sources": list(matched_data.keys())
            })

        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            # Resilient fallback with office contacts
            contacts = college_data.get("contacts_and_directory", {}).get("admissions_helpdesk", {})
            phone = contacts.get("phone", "the college phone line")
            email = contacts.get("email", "admissions@college.edu")
            return jsonify({
                "answer": f"Our AI inquiry service is momentarily busy. Please refer to our admissions desk at {phone} or email {email}. ({FALLBACK_MESSAGE})",
                "sources": ["contacts_and_directory"],
                "warning": "AI service offline fallback activated."
            })

    # Offline / local fallback when API key is not yet set
    contacts = college_data.get("contacts_and_directory", {}).get("admissions_helpdesk", {})
    return jsonify({
        "answer": (
            f"Welcome to {college_name}! (Notice: GEMINI_API_KEY is not configured on the backend yet).\n\n"
            f"To get in touch directly, please call Admissions at {contacts.get('phone', 'N/A')} "
            f"or email {contacts.get('email', 'N/A')}. You can also explore the Knowledge Directory tab."
        ),
        "sources": ["contacts_and_directory"]
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting College Query Chatbot Flask backend on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
