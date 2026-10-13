import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '5mb' }));

// College Data Storage Path
const DATA_FILE = path.resolve(process.cwd(), 'college_data.json');

// Helper to read college data
function getCollegeData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading college_data.json:', err);
  }
  return {};
}

// Helper to save updated college data
function saveCollegeData(data: Record<string, unknown>) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    const backendDataPath = path.resolve(process.cwd(), 'backend', 'college_data.json');
    if (fs.existsSync(path.dirname(backendDataPath))) {
      fs.writeFileSync(backendDataPath, JSON.stringify(data, null, 2), 'utf-8');
    }
    return true;
  } catch (err) {
    console.error('Error writing college_data.json:', err);
    return false;
  }
}

// In-memory cache
let cachedCollegeData = getCollegeData();

// Standardized Fallback Message required by prompt
const FALLBACK_MESSAGE =
  "Sorry, I couldn't find this information in the available college records. Please contact the college office for confirmation.";

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.warn('Failed to initialize GoogleGenAI client:', e);
  }
}

// Keyword relevance filtering to send targeted data to model
function extractRelevantContext(userQuery: string, data: Record<string, any>) {
  const q = userQuery.toLowerCase();
  const relevant: Record<string, any> = {
    institution: data.institution || {},
  };

  if (
    q.includes('admit') ||
    q.includes('admission') ||
    q.includes('eligib') ||
    q.includes('apply') ||
    q.includes('form') ||
    q.includes('entrance') ||
    q.includes('cet') ||
    q.includes('jee') ||
    q.includes('seat') ||
    q.includes('date') ||
    q.includes('quota') ||
    q.includes('reservation')
  ) {
    relevant.admissions = data.admissions || {};
    relevant.courses = data.courses || [];
  }

  if (
    q.includes('fee') ||
    q.includes('tuition') ||
    q.includes('cost') ||
    q.includes('pay') ||
    q.includes('charge') ||
    q.includes('refund') ||
    q.includes('deposit') ||
    q.includes('installment')
  ) {
    relevant.fee_structure = data.fee_structure || {};
    relevant.scholarships = data.scholarships || [];
  }

  if (
    q.includes('course') ||
    q.includes('department') ||
    q.includes('branch') ||
    q.includes('b.tech') ||
    q.includes('btech') ||
    q.includes('m.tech') ||
    q.includes('mba') ||
    q.includes('curriculum') ||
    q.includes('syllabus') ||
    q.includes('subject')
  ) {
    relevant.courses = data.courses || [];
    relevant.faculty = data.faculty || {};
  }

  if (
    q.includes('faculty') ||
    q.includes('prof') ||
    q.includes('teacher') ||
    q.includes('hod') ||
    q.includes('head') ||
    q.includes('dean') ||
    q.includes('ratio')
  ) {
    relevant.faculty = data.faculty || {};
  }

  if (
    q.includes('exam') ||
    q.includes('grading') ||
    q.includes('grade') ||
    q.includes('cgpa') ||
    q.includes('sgpa') ||
    q.includes('backlog') ||
    q.includes('attendance') ||
    q.includes('fail') ||
    q.includes('pass') ||
    q.includes('revaluation') ||
    q.includes('schedule')
  ) {
    relevant.examinations_and_academics = data.examinations_and_academics || {};
  }

  if (
    q.includes('place') ||
    q.includes('placement') ||
    q.includes('package') ||
    q.includes('salary') ||
    q.includes('lpa') ||
    q.includes('recruit') ||
    q.includes('company') ||
    q.includes('intern') ||
    q.includes('internship')
  ) {
    relevant.placements_and_internships = data.placements_and_internships || {};
  }

  if (
    q.includes('scholarship') ||
    q.includes('financial aid') ||
    q.includes('waiver') ||
    q.includes('concession') ||
    q.includes('grant')
  ) {
    relevant.scholarships = data.scholarships || [];
  }

  if (
    q.includes('hostel') ||
    q.includes('room') ||
    q.includes('mess') ||
    q.includes('food') ||
    q.includes('bus') ||
    q.includes('transport') ||
    q.includes('library') ||
    q.includes('lab') ||
    q.includes('gym') ||
    q.includes('sport') ||
    q.includes('hospital') ||
    q.includes('clinic') ||
    q.includes('curfew') ||
    q.includes('facility') ||
    q.includes('facilities')
  ) {
    relevant.facilities = data.facilities || {};
  }

  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('email') ||
    q.includes('address') ||
    q.includes('number') ||
    q.includes('location') ||
    q.includes('office') ||
    q.includes('helpline') ||
    q.includes('website') ||
    q.includes('link')
  ) {
    relevant.contacts_and_directory = data.contacts_and_directory || {};
  }

  // If minimal match, provide the entire record to be safe
  if (Object.keys(relevant).length <= 1) {
    return data;
  }

  // Always append contacts for escalation
  if (!relevant.contacts_and_directory && data.contacts_and_directory) {
    relevant.contacts_and_directory = data.contacts_and_directory;
  }

  return relevant;
}

// 1. GET College Information
app.get('/api/college-data', (_req: Request, res: Response) => {
  cachedCollegeData = getCollegeData();
  res.json(cachedCollegeData);
});

// 2. POST Update College Information
app.post('/api/college-data', (req: Request, res: Response) => {
  const updatedData = req.body;
  if (!updatedData || typeof updatedData !== 'object') {
    res.status(400).json({ error: 'Invalid college data payload' });
    return;
  }
  const ok = saveCollegeData(updatedData);
  if (ok) {
    cachedCollegeData = updatedData;
    res.json({ success: true, message: 'College information saved successfully' });
  } else {
    res.status(500).json({ error: 'Failed to write college data file' });
  }
});

// 3. POST Chat Query
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const currentData = cachedCollegeData && Object.keys(cachedCollegeData).length > 0
      ? cachedCollegeData
      : getCollegeData();

    const matchedData = extractRelevantContext(message, currentData);
    const collegeName = currentData?.institution?.name || 'our institution';

    // Strict Grounding System Prompt
    const systemPrompt = `You are the official Campus Query Assistant for ${collegeName}.
Your role is to assist students, applicants, and parents by answering questions strictly and exclusively using the verified college records supplied below.

CRITICAL RULES:
1. If the exact answer or specific policy is NOT found in the provided college records, you MUST state exactly:
"${FALLBACK_MESSAGE}"
2. NEVER invent, extrapolate, or guess fee amounts, dates, cutoffs, admission rules, faculty names, or official policies.
3. Present figures (fees, package LPA, attendance %) accurately using clean bullet points and bold highlights.
4. When relevant, reference official contact numbers, office locations, and links provided in the records.
5. If the user greeting is conversational (e.g. "hi", "hello", "good morning"), introduce yourself warmly as the official Campus Query Assistant for ${collegeName} and list the core topics you can assist with: Admissions, Fees, Courses, Faculty, Exams, Placements, and Campus Facilities.

OFFICIAL COLLEGE RECORDS:
${JSON.stringify(matchedData, null, 2)}`;

    if (ai) {
      // Build conversation payload
      const contentsPayload: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-4);
        for (const item of recentHistory) {
          if (item.sender === 'user') {
            contentsPayload.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'bot') {
            contentsPayload.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      contentsPayload.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Try gemini-3.1-flash-lite for instant latency, with fallback to gemini-3.8-flash
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let answerText: string | null = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contentsPayload,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.15,
            },
          });

          if (response.text) {
            answerText = response.text;
            break;
          }
        } catch (modelError: any) {
          console.warn(`Model ${modelName} encountered error:`, modelError?.message || modelError);
          // Continue to next candidate model
        }
      }

      if (answerText) {
        const cleanAnswer = answerText.replace(/^["'“‘]+|["'”’]+$/g, '').trim();
        res.json({
          answer: cleanAnswer,
          sources: Object.keys(matchedData),
        });
        return;
      }
    }

    // Direct fallback response if all AI calls fail or key is not provided
    const contacts = currentData?.contacts_and_directory?.admissions_helpdesk || {};
    const helpline = currentData?.contacts_and_directory?.student_grievance_and_helpline || {};
    const qLower = message.toLowerCase();

    let localAnswer = '';
    if (qLower.includes('fee') || qLower.includes('tuition')) {
      const fees = currentData?.fee_structure?.annual_tuition_fees || [];
      localAnswer = `**Annual Tuition Fees for ${collegeName}:**\n\n` +
        fees.map((f: any) => `• **${f.course}**: ${f.total_annual_academic_fee} per year (Tuition: ${f.tuition_fee_per_year})`).join('\n') +
        `\n\n• **Hostel Fee**: ${currentData?.fee_structure?.hostel_and_mess_fees?.double_sharing_room || 'Contact office'}\n` +
        `• **Accounts Office**: ${currentData?.contacts_and_directory?.accounts_and_fees?.phone || 'Contact Admin block'}`;
    } else if (qLower.includes('admit') || qLower.includes('admission') || qLower.includes('apply')) {
      localAnswer = `**Admissions Information (${currentData?.admissions?.academic_year || 'Current Year'}):**\n\n` +
        `• **UG Eligibility**: ${currentData?.admissions?.eligibility_ug?.minimum_marks}\n` +
        `• **Entrance Exams**: ${currentData?.admissions?.eligibility_ug?.accepted_entrance_exams?.join(', ')}\n` +
        `• **Application Portal**: [Admissions Portal](${currentData?.institution?.admissions_portal})\n` +
        `• **Admissions Desk**: ${contacts.phone || 'Available in Admin block'}`;
    } else if (qLower.includes('place') || qLower.includes('package') || qLower.includes('salary')) {
      const p = currentData?.placements_and_internships || {};
      localAnswer = `**Placements & Career Statistics:**\n\n` +
        `• **Placement Rate**: ${p.overall_placement_rate || 'N/A'}\n` +
        `• **Highest Package**: **${p.highest_salary_package}**\n` +
        `• **Average Package**: **${p.average_salary_package}**\n` +
        `• **Top Recruiters**: ${p.top_recruiters?.slice(0, 6).join(', ')}\n` +
        `• **Training Cell**: ${currentData?.contacts_and_directory?.training_and_placement_cell?.email}`;
    } else {
      localAnswer = `${FALLBACK_MESSAGE}\n\n` +
        `• **Admissions Office**: ${contacts.phone || 'N/A'} (${contacts.email || ''})\n` +
        `• **Emergency Helpline**: ${helpline.emergency_24x7 || 'N/A'}\n` +
        `• **Campus Address**: ${currentData?.institution?.campus_address || ''}`;
    }

    res.json({
      answer: localAnswer,
      sources: Object.keys(matchedData),
    });
  } catch (error) {
    console.error('Server chat error:', error);
    res.status(500).json({
      answer: FALLBACK_MESSAGE,
      sources: ['contacts_and_directory'],
      error: 'An internal server error occurred. Please contact the college office directly.',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusQuery Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
