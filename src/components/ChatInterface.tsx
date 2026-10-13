import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Trash2,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CornerDownLeft,
  ArrowRight,
  User,
  GraduationCap
} from 'lucide-react';
import { ChatMessage, CollegeData } from '../types';

interface ChatInterfaceProps {
  collegeData: CollegeData;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => void;
  onClearChat: () => void;
  onOpenDirectory: () => void;
}

// Curated suggested prompt questions
const SUGGESTED_QUESTIONS = [
  {
    category: 'Admissions',
    question: 'What are the eligibility criteria and key dates for admissions?',
  },
  {
    category: 'Fees',
    question: 'What is the annual fee structure for B.Tech Computer Science?',
  },
  {
    category: 'Placements',
    question: 'What were the highest and average salary packages in placements?',
  },
  {
    category: 'Hostel & Rules',
    question: 'What are the hostel room charges, mess plan, and curfew timings?',
  },
  {
    category: 'Academics',
    question: 'What is the minimum attendance requirement and grading scale?',
  },
  {
    category: 'Scholarships',
    question: 'What merit and need-based scholarships does the college provide?',
  },
  {
    category: 'Contacts',
    question: 'Where can I contact the Admissions Helpdesk and Accounts Office?',
  },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  collegeData,
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onOpenDirectory,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const institution = collegeData.institution;
  const collegeName = institution?.name || 'College Query Assistant';

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopyText = (id: string, text: string) => {
    // Strip surrounding quotes if any
    const clean = text.replace(/^["'“‘]+|["'”’]+$/g, '').trim();
    navigator.clipboard.writeText(clean);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Resilient markdown-like formatter for bot text with clean quotation removal
  const renderFormattedText = (rawText: string) => {
    // Strip unnecessary surrounding quotes from the whole answer
    const cleanedText = rawText.replace(/^["'“‘]+|["'”’]+$/g, '').trim();
    const lines = cleanedText.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed text-slate-800">
        {lines.map((line, idx) => {
          let trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Strip accidental leading/trailing quotes on individual lines
          trimmed = trimmed.replace(/^["'“‘]+|["'”’]+$/g, '').trim();

          // Bullet points
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
            const content = trimmed.replace(/^[•\-\*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-0.5">
                <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                <span className="flex-1">{formatInline(content)}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+[\.\)])\s*(.+)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-0.5">
                <span className="text-slate-900 font-semibold shrink-0 tabular-nums">
                  {numMatch[1]}
                </span>
                <span className="flex-1">{formatInline(numMatch[2])}</span>
              </div>
            );
          }

          // Regular paragraph
          return <p key={idx}>{formatInline(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Helper for inline bold, links, code formatting
  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      // Bold **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Markdown link [Title](URL)
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-900 underline decoration-amber-400 font-medium inline-flex items-center gap-0.5"
          >
            <span>{linkMatch[1]}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Session Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-slate-700">Verified Grounded Mode</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Responses constrained strictly to official records</span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
            title="Clear chat history and start a new conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 sm:pr-2">
        {/* Welcome Card if chat is empty */}
        {messages.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Campus Photo Header */}
            <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden">
              <img
                src="/src/assets/images/campus_quad_academic_1791902088240.jpg"
                alt="Collegiate campus quad and academic brick architecture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                  Campus Admissions & Student Helpdesk
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  {collegeName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-1">
                  Ask any question about eligibility, fees, faculty, exams, placements, and campus amenities.
                </p>
              </div>
            </div>

            {/* Prompt Starter Section */}
            <div className="p-4 sm:p-6 bg-slate-50/50 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Frequently Asked Student Questions</span>
                </div>
                <button
                  onClick={onOpenDirectory}
                  className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                >
                  <span>Browse Directory</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGGESTED_QUESTIONS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(item.question)}
                    className="flex items-start gap-2.5 p-3 text-left bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-xl transition-all text-xs sm:text-sm text-slate-700 hover:text-slate-900 group shadow-2xs"
                  >
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 shrink-0">
                      {item.category}
                    </span>
                    <span className="flex-1 font-medium">{item.question}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Chat Messages */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`rounded-2xl px-4 py-3.5 max-w-[92%] sm:max-w-[82%] ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                    : msg.isError
                    ? 'bg-rose-50 border border-rose-200 text-slate-900 rounded-tl-xs'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Message Header with Avatar Icon */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/5 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {isUser ? (
                      <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                        <User className="w-2.5 h-2.5" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <GraduationCap className="w-3 h-3" />
                      </div>
                    )}
                    <span
                      className={`font-semibold ${
                        isUser ? 'text-amber-400' : 'text-slate-700'
                      }`}
                    >
                      {isUser ? 'You' : 'Campus Assistant'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="tabular-nums">{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
                        title="Copy message to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                {isUser ? (
                  <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                ) : (
                  <div>
                    {renderFormattedText(msg.text)}

                    {/* Source Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-600">Referenced:</span>
                        {msg.sources.map((src, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] capitalize"
                          >
                            {src.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start max-w-[80%]">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
              <div className="flex items-center gap-3 text-slate-500 text-xs">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                </div>
                <span>Checking verified records...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips row if chat is in progress */}
      {messages.length > 0 && (
        <div className="py-2 overflow-x-auto whitespace-nowrap flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Related topics:</span>
          {SUGGESTED_QUESTIONS.slice(0, 4).map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(s.question)}
              className="text-xs px-3 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-slate-900 rounded-full transition-colors shrink-0 shadow-2xs"
            >
              {s.category}: {s.question.slice(0, 32)}...
            </button>
          ))}
        </div>
      )}

      {/* Message Input Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-2 bg-white border border-slate-300 rounded-2xl p-1.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 shadow-sm transition-all flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask about ${institution?.short_name || 'college'} admissions, fees, courses, placements...`}
          className="flex-1 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-slate-950 font-semibold text-xs sm:text-sm rounded-xl transition-colors disabled:cursor-not-allowed shadow-xs shrink-0"
        >
          <span>Send</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Footnote on grounding */}
      <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
        <span>Factual answers strictly verified against institutional records.</span>
      </div>
    </div>
  );
};
