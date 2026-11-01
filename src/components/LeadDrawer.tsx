import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  Calendar,
  Phone,
  Users,
  Sparkles,
  ExternalLink,
  Trash2,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { LeadStatus, WhatsAppTemplateId } from '../types/lead';
import { formatINR, generateWhatsAppPitch } from '../services/leadService';

export const LeadDrawer: React.FC = () => {
  const {
    selectedLead,
    setSelectedLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    showToast,
  } = useLeads();

  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateId>('initial');
  const [notesInput, setNotesInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Sync notes when selected lead changes
  React.useEffect(() => {
    if (selectedLead) {
      setNotesInput(selectedLead.notes || '');
      setSelectedTemplate('initial');
    }
  }, [selectedLead?.id]);

  if (!selectedLead) return null;

  // Generate WhatsApp message based on chosen template
  const activePitchText = generateWhatsAppPitch(
    {
      client_name: selectedLead.client_name,
      event_type: selectedLead.event_type,
      event_date: selectedLead.event_date,
      calculated_quote: selectedLead.calculated_quote,
      chat_summary: selectedLead.chat_summary,
      selected_addons: selectedLead.selected_addons,
    },
    selectedTemplate
  );

  const handleCopyPitch = async () => {
    try {
      await navigator.clipboard.writeText(activePitchText);
      setCopied(true);
      showToast('Copied to Clipboard! ✅', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = activePitchText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      showToast('Copied to Clipboard! ✅', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    const cleanDigits = selectedLead.client_phone.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(activePitchText);
    window.open(`https://wa.me/${cleanDigits}?text=${encodedMsg}`, '_blank');
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await updateLead(selectedLead.id, { notes: notesInput });
    setIsSavingNotes(false);
    showToast('Studio notes saved!', 'success');
  };

  const handleQuickFollowUp = async (days: number) => {
    const newDate = new Date(Date.now() + days * 86400 * 1000).toISOString().slice(0, 10);
    await updateLead(selectedLead.id, { follow_up_date: newDate });
    showToast(`Follow-up scheduled for ${newDate}`, 'info');
  };

  const priorityBadge = (label: string) => {
    switch (label) {
      case 'High-Value':
        return 'bg-red-500/15 text-red-400 border-red-500/40';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Standard':
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div
        className="w-full max-w-xl bg-[#0F0F14] border-l border-[#27272E] shadow-2xl h-full flex flex-col text-white transform transition-transform duration-300 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 bg-[#14141B] border-b border-[#27272E] flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${priorityBadge(selectedLead.label)}`}>
                {selectedLead.label} Priority
              </span>
              <span className="text-xs text-gray-400">
                Logged {new Date(selectedLead.created_at).toLocaleDateString()}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">
              {selectedLead.client_name}
            </h2>
          </div>

          <button
            onClick={() => setSelectedLead(null)}
            className="p-2 rounded-xl bg-[#1D1D26] hover:bg-[#272733] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#16161E] border border-[#27272E]">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Client Phone</span>
              </span>
              <span className="font-mono text-sm font-semibold text-gray-100">
                {selectedLead.client_phone}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161E] border border-[#27272E]">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Event Date</span>
              </span>
              <span className="font-mono text-sm font-semibold text-gray-100">
                {selectedLead.event_date}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161E] border border-[#27272E]">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Guest Count</span>
              </span>
              <span className="font-medium text-sm text-gray-100">
                ~{selectedLead.guest_count} Attendees
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161E] border border-[#27272E]">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Calculated Quote</span>
              </span>
              <span className="font-serif text-lg font-bold text-[#D4AF37]">
                {formatINR(selectedLead.calculated_quote)}
              </span>
            </div>
          </div>

          {/* Add-ons Display */}
          {selectedLead.selected_addons && selectedLead.selected_addons.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#16161E] border border-[#27272E]">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Requested Add-Ons &amp; Upgrades</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLead.selected_addons.map((addon, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-[#242430] border border-[#3A3A4A] text-gray-200 font-medium"
                  >
                    ✨ {addon}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status Quick Updater */}
          <div className="p-4 rounded-xl bg-[#14141A] border border-[#27272E]">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Update Lead Status:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['New', 'Contacted', 'Booked', 'Archived'] as LeadStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => updateLeadStatus(selectedLead.id, st)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    selectedLead.status === st
                      ? 'bg-[#D4AF37] text-black shadow-gold-sm font-bold'
                      : 'bg-[#1C1C24] text-gray-300 hover:bg-[#282834]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Line AI Generated Chat Summary */}
          <div className="p-4 rounded-xl bg-[#14141B] border border-[#D4AF37]/30 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                AI-Generated Chat Summary
              </span>
            </div>
            <p className="font-mono text-xs text-gray-200 whitespace-pre-line leading-relaxed bg-[#0A0A0D] p-3 rounded-lg border border-[#27272E]">
              {selectedLead.chat_summary || 'No summary generated yet.'}
            </p>
          </div>

          {/* KILLER FEATURE: Ready-to-Copy WhatsApp Pitch with Multi-Template Selector */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121A14] to-[#0D140E] border-2 border-emerald-500/40 shadow-luxury relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Smart WhatsApp Pitch Engine
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    Choose specialized follow-up cadence
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                1-Click Dispatch
              </span>
            </div>

            {/* Template Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
              {[
                { id: 'initial', label: '📸 Initial Pitch' },
                { id: 'urgency_hold', label: '⏳ 48h Hold' },
                { id: 'festival_bonus', label: '🎁 Free Drone' },
                { id: 'call_confirm', label: '📞 Call Today' },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id as WhatsAppTemplateId)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                    selectedTemplate === tpl.id
                      ? 'bg-emerald-500 text-black font-bold shadow-sm'
                      : 'bg-black/50 text-gray-300 hover:bg-black/80 border border-emerald-500/20'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>

            {/* The dynamic message content */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/20 text-xs sm:text-sm text-gray-100 font-sans leading-relaxed whitespace-pre-line select-text">
              {activePitchText}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleCopyPitch}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-md ${
                  copied
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-[#D4AF37] hover:bg-[#E5C048] text-black hover:brightness-110 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied! ✅</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenWhatsApp}
                title="Directly launch WhatsApp chat"
                className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
              >
                <span>Launch WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Studio Internal Notes & Follow-up Planner */}
          <div className="p-4 rounded-xl bg-[#14141B] border border-[#27272E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Studio Internal Notes</span>
              </span>
              <button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-3 py-1 rounded-lg bg-[#D4AF37] hover:bg-[#E5C048] text-black text-xs font-bold shadow-sm transition-all"
              >
                {isSavingNotes ? 'Saving...' : 'Save Note'}
              </button>
            </div>

            <textarea
              rows={2}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. Client requested evening call, budget discussion, father's number..."
              className="w-full p-2.5 rounded-lg bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] outline-none text-xs text-white placeholder-gray-600 resize-none"
            />

            {/* Quick Follow-up Date Scheduler */}
            <div className="pt-2 border-t border-[#23232D] flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                <span>Next Follow-up: <strong className="text-white">{selectedLead.follow_up_date || 'Not set'}</strong></span>
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleQuickFollowUp(1)}
                  className="px-2 py-0.5 rounded bg-[#20202A] hover:bg-[#2B2B38] text-[10px] text-gray-300"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => handleQuickFollowUp(3)}
                  className="px-2 py-0.5 rounded bg-[#20202A] hover:bg-[#2B2B38] text-[10px] text-gray-300"
                >
                  +3 Days
                </button>
                <button
                  onClick={() => handleQuickFollowUp(7)}
                  className="px-2 py-0.5 rounded bg-[#20202A] hover:bg-[#2B2B38] text-[10px] text-gray-300"
                >
                  +1 Week
                </button>
              </div>
            </div>
          </div>

          {/* Delete lead option */}
          <div className="pt-2 text-right">
            <button
              onClick={() => deleteLead(selectedLead.id)}
              className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 ml-auto transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Lead Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
