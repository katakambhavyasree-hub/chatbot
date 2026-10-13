# College Query Chatbot & Campus Knowledge Hub

A simple, professional, and fully responsive College Query Chatbot Web Application designed to give students, parents, and applicants instant, accurate answers about admissions, fees, courses, exams, placements, scholarships, facilities, and contact details, grounded in an easily customizable college knowledge base.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **Default College Profile**: Configured as a comprehensive sample college with clearly annotated, easy-to-replace placeholders for courses, fees, admissions, facilities, and links.
> - **Visual Identity**: Collegiate Navy (`#0F172A`, `#1E293B`) paired with warm amber accents (`#D97706`) and clean academic editorial typography.
> - **Dual View Experience**: Includes both the Conversational Chatbot view and an interactive Knowledge Base Explorer tab to browse, search, and verify college data categories directly.
> - **Dual-Stack Delivery**: Live full-stack execution within AI Studio via Express + server-side Gemini 3.8 Flash SDK, accompanied by a clean, complete Python Flask backend implementation (`backend/app.py`, `backend/requirements.txt`, `backend/college_data.json`) and a step-by-step setup guide for standalone Python deployment.

---

### 1. Overview & Core Concept

- **What It Does**: Provides students and prospective applicants with a conversational query interface that answers natural-language questions about college policies, fees, admissions, faculty, placements, and campus facilities. If a specific detail is not found in the verified college records, it strictly informs the user and directs them to the official office contacts rather than hallucinating.
- **Target Audience & Persona**: Prospective students evaluating degree programs and fees, enrolled students checking exam schedules and regulations, and administrative staff seeking a unified campus query portal.
- **Key Value**: Delivers zero-hallucination, grounded college answers in seconds while keeping the underlying dataset in a clean, easily editable JSON format that any institution can customize without machine learning complexity.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Welcome & Orientation*: The user enters a campus portal header displaying the institution wordmark, quick stats, and a top navigation switch between "Campus Chatbot" and "Knowledge Directory".
  2. *Quick Prompt Starters*: 6–8 curated prompt chips (e.g., "What is the B.Tech Computer Science fee structure?", "What are the eligibility criteria for admissions?", "Tell me about placement statistics", "Hostel fees and curfew timings") allow one-click inquiries.
  3. *Grounded Conversational Dialogue*: Students ask questions in natural language. Answers format key numbers (fees, dates, percentages) cleanly, cite official website links, and provide contact details for college officers.
  4. *Knowledge Directory & Live Inspection*: Users can switch to the Knowledge Directory to filter and view college data by category (Admissions, Fees, Courses, Faculty, Placements, Facilities, Contacts). A "Customize Data" modal enables downloading or testing updated JSON records.
  5. *Conversation Management*: Students can clear history, copy answers to clipboard, or regenerate answers if needed.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Collegiate, authoritative, and human-centered academic portal. Clean hairline dividers, single-elevation card architecture, and intentional typography.
  - *Color Palette (60-30-10 Rule)*:
    - 60% Dominant Neutral Canvas: Crisp academic off-white (`#F8FAFC`) with deep navy text (`#0F172A`).
    - 30% Structural Surfaces: Slate cards (`#FFFFFF` with subtle `#E2E8F0` hairline borders) and dark navy header surface (`#0F172A`).
    - 10% Accent Budget: Warm Amber / Academic Gold (`#D97706`, `#B45309`) concentrated on action buttons, active tab indicators, and citation tags.
  - *Typography & Hierarchy*: Plus Jakarta Sans for structural headings and brand wordmark; DM Sans for readable body prose; tabular numerals (`tabular-nums`) for fee amounts and academic cutoffs.
  - *Anti-Slop Restraint*: Unboxed metadata with typographic separators (`·`), zero floating capsule badge sandwiches, zero code-syntax headers (`//`), no decorative pulsing status dots, and no roleplay jargon.

- **Interactive Feedback & Motion**:
  - Responsive typing indicator with smooth animated dot-wave.
  - Smooth message list auto-scroll with user scroll lock detection.
  - Resilient error handling showing friendly, non-technical recovery suggestions if network or API keys are unavailable.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Grounded Prompt Engineering with Zero-Hallucination Guardrails**
  - *Chosen Approach*: Query processing sends relevant slices of `college_data.json` to `gemini-3.8-flash` on the server side with strict system instructions: answers must be solely derived from the provided records. If information is missing, the model returns the standardized fallback message with office contact details.
  - *Why*: Absolute reliability for academic compliance. Colleges cannot afford hallucinated fee amounts or fabricated admission deadlines.
  - *Alternatives Considered*: Vector embeddings/RAG pipelines (unnecessary complexity and extra infrastructure for a structured institutional handbook).

- **Decision 2: Dual Implementation Support (Live Express + Standalone Flask)**
  - *Chosen Approach*: The primary web app runs with a robust server-side Express API and Vite frontend to ensure zero-friction, instant preview in the browser container. In parallel, a clean `backend/` folder contains `app.py`, `requirements.txt`, `college_data.json`, and `.env.example` with clear instructions so the user can run the Python Flask backend locally whenever desired.
  - *Why*: Gives the user their exact requested Python Flask architecture while keeping the live deployed preview in AI Studio 100% operational.

- **Decision 3: Integrated Knowledge Base Explorer**
  - *Chosen Approach*: Beside the chat stream, provide an interactive tab view where students or administrators can browse and search the structured college data by category, complete with an export/import tool to swap sample data with real institution data.
  - *Why*: Fulfills the requirement for transparent, editable college data and helps non-technical staff verify data accuracy.

---

### 4. Technical Architecture & Data Strategy (Technical Reference)

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           Client Browser (React 19)                       │
├─────────────────────────────────────┬─────────────────────────────────────┤
│        Campus Chatbot View          │      Knowledge Directory View       │
│  - Suggested Prompt Starters        │  - Category Filter (Admissions/Fees)│
│  - Chat History & Markdown Text     │  - Search & Keyword Filtering       │
│  - Clear Chat & Retry Actions       │  - Data Export & Customizer Modal   │
└───────────────────┬─────────────────┴──────────────────┬──────────────────┘
                    │                                    │
                    │ POST /api/chat                     │ GET /api/college-data
                    ▼                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      Server-Side Backend (Node/Express)                   │
│                       [+ Python Flask Backend Scripts]                    │
├───────────────────────────────────────────────────────────────────────────┤
│  - Loads & caches `college_data.json`                                     │
│  - Keyword & semantic topic matching to send relevant data chunks        │
│  - Injects strict institutional system prompt guardrails                 │
│  - Invokes Google GenAI SDK (`gemini-3.8-flash`) via GEMINI_API_KEY      │
│  - Returns formatted answer + topic source citations                     │
└───────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & Schema (`college_data.json`)**:
  - `institution`: Name, code, accreditation, address, established year, motto, campus map link.
  - `admissions`: Eligibility criteria, entry exams, application dates, reservation quotas, steps to apply.
  - `courses`: Undergrad, postgrad, doctoral degrees with duration, department, seats, and semester breakdown.
  - `fee_structure`: Tuition, hostel, caution deposits, payment schedules, refund policies.
  - `faculty`: Department heads, faculty ratios, research labs.
  - `examinations`: Grading scale, credit requirements, backlog policies, academic calendar.
  - `placements`: Highest/average packages, top recruiting partners, training cell contacts.
  - `scholarships`: Merit, economic need, sports quotas, application deadlines.
  - `facilities`: Central library, labs, hostels, bus transport routes, sports grounds.
  - `contacts`: Dean, admissions desk, fee counter, emergency helpline, email, official website links.

- **Interactive State & Event Handling**:
  - `messages`: Array of `{ id, sender: 'user' | 'bot', text, timestamp, citations, isError }`.
  - `isLoading`: Boolean disabling double submissions and rendering the typing indicator.
  - `activeCategory`: Category filter state in the Knowledge Directory.
  - `searchQuery`: Real-time instant search across all JSON fields.
  - `errorRecovery`: Automatic fallback to direct contact details if the AI service encounters an issue.
