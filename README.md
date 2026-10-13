# CampusQuery - College Query Chatbot & Knowledge Hub

A simple, professional, and reliable College Query Chatbot Web Application built to answer students' and parents' questions regarding admissions, fees, courses, exams, placements, scholarships, and campus facilities.

The chatbot uses **Google Gemini API** (`gemini-3.8-flash`) and enforces **strict grounding**: it answers questions solely using the verified institutional records in `college_data.json`. If an answer is not found in the records, it directs the student to the official admissions helpdesk rather than guessing or hallucinating numbers.

---

## 🏛️ Features

1. **Conversational Campus Assistant**:
   - Natural language question answering for prospective applicants and enrolled students.
   - Quick starter prompt chips for common questions (Eligibility, Fees, Placements, Hostels).
   - Clear conversation button to start fresh sessions.
   - Clean, readable formatting with bold highlights, bullet points, and official website links.
   - Grounded citations indicating which college record sections were referenced.

2. **Grounded Institutional Knowledge Base**:
   - Stored in a simple, well-structured `college_data.json` file.
   - Covers:
     - College name, address, accreditation, and office hours
     - Undergraduate and postgraduate courses and seat intake
     - Detailed fee structures, payment schedules, and refund policies
     - Eligibility cutoffs, accepted entrance exams, and application deadlines
     - Department heads and faculty-to-student ratios
     - Examination schedules, grading scales, and attendance criteria (75% rule)
     - Placement statistics, average/highest salary packages, and top recruiters
     - Scholarships, merit concessions, and EWS grants
     - Hostels, curfew timings, library access, and bus transport
     - Contact directory and emergency helplines

3. **Interactive Knowledge Directory**:
   - Live search across all degrees, fee amounts, and faculty members.
   - Category filters (Admissions, Courses, Fees, Placements, Facilities, Contacts).
   - Direct chatbot inquiry triggers on each academic department card.

---

## 📁 Project Structure

```text
college-query-chatbot/
│
├── college_data.json          # Master college records (JSON knowledge base)
├── server.ts                  # Node.js/Express server (powers live web app + Gemini API)
├── package.json               # Frontend dependencies & scripts
│
├── src/                       # React 19 Frontend (Vite + Tailwind CSS)
│   ├── App.tsx                # Main application state and coordinator
│   ├── types.ts               # TypeScript data definitions
│   ├── components/
│   │   ├── Header.tsx         # Academic Top Bar & brand wordmark
│   │   ├── ChatInterface.tsx  # Chat stream, prompts & message renderer
│   │   ├── KnowledgeExplorer.tsx # Interactive directory & JSON customizer
│   │   └── CollegeInfoModal.tsx  # Office directory & phone numbers
│   └── assets/images/         # Campus photography assets
│
├── backend/                   # Standalone Python Flask Backend
│   ├── app.py                 # Flask server with Gemini API routes
│   ├── college_data.json      # College data copy for Python backend
│   ├── requirements.txt       # Python dependencies (Flask, google-genai)
│   └── .env.example           # Environment variable template
│
└── README.md                  # Beginner setup & customization guide
```
---

## 🔒 Security & Privacy

- The `GEMINI_API_KEY` is strictly accessed on the **server-side** and is **never** exposed to the client browser.
- `.env` files are included in `.gitignore` to prevent leaking secret keys.
- Input questions are sanitized and strictly bound by system instructions to avoid prompt injection.
