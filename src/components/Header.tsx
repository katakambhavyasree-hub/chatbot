import React from 'react';
import { GraduationCap, PhoneCall, Database, MessageSquareText, Building2 } from 'lucide-react';
import { CollegeData } from '../types';

interface HeaderProps {
  collegeData: CollegeData;
  activeTab: 'chat' | 'directory';
  setActiveTab: (tab: 'chat' | 'directory') => void;
  onOpenContacts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  collegeData,
  activeTab,
  setActiveTab,
  onOpenContacts,
}) => {
  const institutionName = collegeData.institution?.name || 'College Query Portal';
  const accreditation = collegeData.institution?.accreditation || 'NAAC A+ Accredited';
  const established = collegeData.institution?.established_year || 1998;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (1 Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                CampusQuery
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-[320px]">
                {institutionName}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line controls) */}
          <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquareText className="w-4 h-4 shrink-0" />
              <span>Campus Chatbot</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>Knowledge Directory</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenContacts}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              title="View official college office phone numbers & contacts"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Office Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unboxed Metadata Banner (Zero-Pill discipline) */}
      <div className="bg-slate-950/70 border-t border-slate-800/80 px-4 sm:px-6 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
            <span className="font-medium text-slate-300">{institutionName}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{accreditation}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Est. {established}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-medium">Admissions 2026-27 Active</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <span>Official Query Portal</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Grounded Records Only</span>
          </div>
        </div>
      </div>
    </header>
  );
};
