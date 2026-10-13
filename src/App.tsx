/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { KnowledgeExplorer } from './components/KnowledgeExplorer';
import { CollegeInfoModal } from './components/CollegeInfoModal';
import { ChatMessage, CollegeData } from './types';

export default function App() {
  const [collegeData, setCollegeData] = useState<CollegeData>({});
  const [activeTab, setActiveTab] = useState<'chat' | 'directory'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch initial college knowledge base from server
  const fetchCollegeData = useCallback(async () => {
    try {
      const res = await fetch('/api/college-data');
      if (res.ok) {
        const data = await res.json();
        setCollegeData(data);
      }
    } catch (err) {
      console.error('Failed to load initial college records:', err);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    fetchCollegeData();
  }, [fetchCollegeData]);

  // Send message to Gemini / Express server backend
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer || "Sorry, I couldn't find this information in the available college records. Please contact the college office for confirmation.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sources: data.sources || [],
        isError: !res.ok,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat request error:', error);
      const fallbackHelp = collegeData.contacts_and_directory?.admissions_helpdesk?.phone || '+91 80 2345 6789';
      const botErrorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `Sorry, I couldn't reach the college records service at this moment. Please call our admissions desk at ${fallbackHelp} or email admissions@college.edu for immediate assistance.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sources: ['contacts_and_directory'],
        isError: true,
      };
      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat conversation
  const handleClearChat = () => {
    setMessages([]);
  };

  // Cross-view interaction: Ask about topic from Directory
  const handleAskQuestionFromDirectory = (question: string) => {
    setActiveTab('chat');
    handleSendMessage(question);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-300">
            Initializing Campus Query Assistant...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Universal Top Bar */}
      <Header
        collegeData={collegeData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenContacts={() => setIsContactsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'chat' ? (
          <ChatInterface
            collegeData={collegeData}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onOpenDirectory={() => setActiveTab('directory')}
          />
        ) : (
          <KnowledgeExplorer
            collegeData={collegeData}
            onAskQuestion={handleAskQuestionFromDirectory}
          />
        )}
      </main>

      {/* Quick Office Contacts & Helplines Modal */}
      <CollegeInfoModal
        collegeData={collegeData}
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </div>
  );
}
