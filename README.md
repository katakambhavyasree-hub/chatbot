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

## 🚀 Beginner Setup Guide

You can run this project in two ways:

### Option A: Running the Full-Stack Web App (Recommended)

The easiest way to run the complete web application with both the frontend and server-side Gemini integration:

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Configure your Gemini API key**:
   Ensure `GEMINI_API_KEY` is defined in your environment or `.env` file:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```
   *(Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/)).*

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit `http://localhost:3000` to interact with the chatbot!

---

### Option B: Running the Python Flask Backend Standalone

If you want to run the Python Flask backend separately:

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment** (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install required Python packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create your `.env` file**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` in a text editor and add your API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=5000
   ```

5. **Run the Flask backend**:
   ```bash
   python app.py
   ```
   The Flask server will start on `http://127.0.0.1:5000`.

---

## ✏️ How to Customize for Your College

All college facts are stored in `college_data.json`. To adapt this chatbot for your own college:

1. Open `college_data.json` in any text editor.
2. Look for the `institution` block:
   - Change `"name"` to your college name.
   - Update `"campus_address"`, `"established_year"`, and official links.
3. Update the `"courses"` list with your degree programs, durations, and seats.
4. Replace the `"fee_structure"` with your official tuition amounts.
5. Update `"contacts_and_directory"` with your admissions phone numbers and email addresses.
6. Save the file. The chatbot will instantly start using your new college information!

---

## 🔒 Security & Privacy

- The `GEMINI_API_KEY` is strictly accessed on the **server-side** and is **never** exposed to the client browser.
- `.env` files are included in `.gitignore` to prevent leaking secret keys.
- Input questions are sanitized and strictly bound by system instructions to avoid prompt injection.
