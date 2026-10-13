import React from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Shield,
  Building,
  GraduationCap
} from 'lucide-react';
import { CollegeData } from '../types';

interface CollegeInfoModalProps {
  collegeData: CollegeData;
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeInfoModal: React.FC<CollegeInfoModalProps> = ({
  collegeData,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const institution = collegeData.institution;
  const contacts = collegeData.contacts_and_directory;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {institution?.name || 'College Directory'}
              </h2>
              <p className="text-xs text-slate-400">
                Official Institutional Directory & Contact Desk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Institutional Highlights */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Campus Address:</span>
                <p className="text-slate-600">{institution?.campus_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/60">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Office Working Hours:</span>
                <p className="text-slate-600">{institution?.working_hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/60">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Accreditation:</span>
                <p className="text-slate-600">{institution?.accreditation}</p>
              </div>
            </div>
          </div>

          {/* Key Office Helplines */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Office Helpdesks
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts?.admissions_helpdesk && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <h4 className="font-bold text-slate-900">Admissions Desk</h4>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contacts.admissions_helpdesk.phone}</span>
                  </p>
                  <p className="text-slate-500 font-mono text-[11px] truncate flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contacts.admissions_helpdesk.email}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">{contacts.admissions_helpdesk.office_location}</p>
                </div>
              )}

              {contacts?.examinations_office && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <h4 className="font-bold text-slate-900">Controller of Examinations</h4>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contacts.examinations_office.phone}</span>
                  </p>
                  <p className="text-slate-500 font-mono text-[11px] truncate flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contacts.examinations_office.email}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">{contacts.examinations_office.office_location}</p>
                </div>
              )}

              {contacts?.accounts_and_fees && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <h4 className="font-bold text-slate-900">Accounts & Fee Counter</h4>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contacts.accounts_and_fees.phone}</span>
                  </p>
                  <p className="text-slate-500 font-mono text-[11px] truncate flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contacts.accounts_and_fees.email}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">{contacts.accounts_and_fees.working_hours}</p>
                </div>
              )}

              {contacts?.student_grievance_and_helpline && (
                <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg text-xs space-y-1">
                  <h4 className="font-bold text-rose-900">Emergency & Helpline</h4>
                  <p className="text-rose-700 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-rose-500" />
                    <span>24x7: {contacts.student_grievance_and_helpline.emergency_24x7}</span>
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <span>Anti-Ragging: {contacts.student_grievance_and_helpline.anti_ragging_toll_free}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Institutional Links */}
          {contacts?.quick_links && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Official Links
              </h3>
              <div className="flex flex-wrap gap-2">
                {contacts.quick_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
