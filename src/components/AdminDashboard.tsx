import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Plus,
  MessageSquare,
  Download,
  Calendar,
  Layers,
  Calculator,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { LeadLabel, LeadStatus, EventType, NewLeadPayload } from '../types/lead';
import { formatINR, calculateBaseQuote, generateWhatsAppPitch, determineLeadLabel } from '../services/leadService';
import { LeadDrawer } from './LeadDrawer';

export const AdminDashboard: React.FC = () => {
  const {
    leads,
    loading,
    setSelectedLead,
    resetMockData,
    refreshLeads,
    showToast,
    setIsSnapBotOpen,
    setIsPackageCustomizerOpen,
    addLead,
  } = useLeads();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLabel, setSelectedLabel] = useState<string>('All');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Lead Form state
  const [manualForm, setManualForm] = useState({
    client_name: '',
    client_phone: '',
    event_type: 'Wedding' as EventType,
    event_date: '',
    guest_count: 500,
    quote: 150000,
    notes: '',
  });

  // Stats calculations:
  const totalInquiries = leads.length;
  const premiumWeddings = leads.filter((l) => l.label === 'High-Value').length;
  const quotePipelineValue = leads
    .filter((l) => l.status === 'New' || l.status === 'Contacted')
    .reduce((sum, l) => sum + (Number(l.calculated_quote) || 0), 0);

  // Pipeline counts
  const newCount = leads.filter((l) => l.status === 'New').length;
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
  const bookedCount = leads.filter((l) => l.status === 'Booked').length;
  const archivedCount = leads.filter((l) => l.status === 'Archived').length;
  const conversionRate = totalInquiries > 0 ? Math.round((bookedCount / totalInquiries) * 100) : 0;

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.client_phone.includes(searchQuery) ||
        lead.event_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All' || lead.status === selectedStatus;

      const matchesLabel =
        selectedLabel === 'All' || lead.label === selectedLabel;

      return matchesSearch && matchesStatus && matchesLabel;
    });
  }, [leads, searchQuery, selectedStatus, selectedLabel]);

  const priorityBadgeStyle = (label: LeadLabel) => {
    switch (label) {
      case 'High-Value':
        return 'bg-red-500/15 text-red-400 border border-red-500/50 shadow-sm';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/50 shadow-sm';
      case 'Standard':
      default:
        return 'bg-sky-500/15 text-sky-300 border border-sky-500/50 shadow-sm';
    }
  };

  const statusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Contacted':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Booked':
        return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50 font-bold';
      case 'Archived':
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Client Name', 'Phone', 'Event Type', 'Event Date', 'Guests', 'Label', 'Status', 'Quote (INR)', 'Notes'];
    const rows = leads.map((l) => [
      `"${l.client_name}"`,
      `"${l.client_phone}"`,
      `"${l.event_type}"`,
      `"${l.event_date}"`,
      l.guest_count,
      `"${l.label}"`,
      `"${l.status}"`,
      l.calculated_quote,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pixelstory_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported leads to CSV!', 'success');
  };

  const handleManualLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.client_name || !manualForm.client_phone || !manualForm.event_date) {
      showToast('Please fill in client name, phone and date', 'warning');
      return;
    }

    const calculated = manualForm.quote || calculateBaseQuote(manualForm.event_type, 'Gold');
    const label = determineLeadLabel(manualForm.event_type);
    const summary = `Manual walk-in inquiry for ${manualForm.event_type} (${manualForm.guest_count} guests) on ${manualForm.event_date}.\nNotes: ${manualForm.notes || 'None'}`;
    const draft = generateWhatsAppPitch({
      client_name: manualForm.client_name,
      event_type: manualForm.event_type,
      event_date: manualForm.event_date,
      calculated_quote: calculated,
      chat_summary: summary,
    });

    await addLead({
      client_name: manualForm.client_name,
      client_phone: manualForm.client_phone,
      event_type: manualForm.event_type,
      event_date: manualForm.event_date,
      guest_count: manualForm.guest_count,
      chat_summary: summary,
      label,
      status: 'New',
      calculated_quote: calculated,
      whatsapp_draft: draft,
      notes: manualForm.notes,
    });

    setIsManualModalOpen(false);
    setManualForm({
      client_name: '',
      client_phone: '',
      event_type: 'Wedding',
      event_date: '',
      guest_count: 500,
      quote: 150000,
      notes: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                Studio Command Center
              </span>
              <span className="text-xs text-gray-400 font-sans">
                PixelStory Studios Hyderabad
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Executive Leads &amp; WhatsApp Automation Engine
            </h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Walk-in Lead</span>
            </button>

            <button
              onClick={() => setIsPackageCustomizerOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#171720] hover:bg-[#20202C] border border-[#2B2B38] text-gray-300 text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4 text-[#D4AF37]" />
              <span>Quote Calculator</span>
            </button>

            <button
              onClick={exportCSV}
              className="px-3 py-2 rounded-xl bg-[#171720] hover:bg-[#20202C] border border-[#2B2B38] text-gray-300 text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={refreshLeads}
              title="Refresh leads from database"
              className="px-3 py-2 rounded-xl bg-[#171720] hover:bg-[#20202C] border border-[#2B2B38] text-gray-300 text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              onClick={resetMockData}
              title="Reset to 5+ realistic Hyderabad leads"
              className="px-3 py-2 rounded-xl bg-[#171720] hover:bg-[#20202C] border border-[#2B2B38] text-gray-300 text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STATS ROW (Metric Cards Required in Phase 4)                */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {/* Card 1: Total Inquiries */}
          <div className="p-5 rounded-2xl glass-panel border border-[#27272E] hover:border-[#D4AF37]/40 transition-all shadow-luxury relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Inquiries
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#1C1C24] border border-[#2C2C38] flex items-center justify-center text-[#D4AF37]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
              {totalInquiries}
            </div>
            <p className="text-[11px] text-gray-400">
              Total rows captured in leads table
            </p>
          </div>

          {/* Card 2: Premium Weddings Booked / High-Value */}
          <div className="p-5 rounded-2xl glass-panel border border-[#27272E] hover:border-red-500/40 transition-all shadow-luxury relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Premium Weddings Booked
              </span>
              <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-red-400 mb-1">
              {premiumWeddings}
            </div>
            <p className="text-[11px] text-gray-400">
              Leads labeled <span className="text-red-400 font-semibold">High-Value</span>
            </p>
          </div>

          {/* Card 3: Quote Pipeline Value */}
          <div className="p-5 rounded-2xl glass-panel border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all shadow-luxury relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quote Pipeline Value
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-1">
              {formatINR(quotePipelineValue)}
            </div>
            <p className="text-[11px] text-gray-400">
              Sum for all <span className="text-emerald-400 font-medium">'New'</span> &amp; <span className="text-purple-400 font-medium">'Contacted'</span> leads
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PIPELINE STAGES VISUAL PROGRESS BAR (ENHANCEMENT)           */}
        {/* ============================================================ */}
        <div className="p-4 rounded-2xl glass-panel border border-[#27272E] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Studio Sales Pipeline
              </span>
              <span className="text-[11px] text-gray-400 block">
                Booking Conversion Rate: <strong className="text-emerald-400">{conversionRate}%</strong>
              </span>
            </div>
          </div>

          {/* Stages Breakdown Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>New: <strong>{newCount}</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Contacted: <strong>{contactedCount}</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              <span>Booked: <strong>{bookedCount}</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-xs font-medium">
              <span>Archived: <strong>{archivedCount}</strong></span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE LEAD TABLE SECTION                              */}
        {/* ============================================================ */}
        <div className="rounded-2xl glass-panel border border-[#27272E] shadow-luxury overflow-hidden">
          {/* Search & Filter Toolbar */}
          <div className="p-4 sm:p-5 border-b border-[#27272E] flex flex-col md:flex-row gap-3 md:items-center justify-between bg-[#111116]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by client name, Hyderabad phone, event..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-xs sm:text-sm text-white placeholder-gray-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Priority Filter */}
              <div className="flex items-center gap-1.5 bg-[#0B0B0E] px-2.5 py-1.5 rounded-xl border border-[#27272E]">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-gray-400">Priority:</span>
                <select
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value)}
                  className="bg-transparent text-white outline-none cursor-pointer font-medium"
                >
                  <option value="All" className="bg-[#121216]">All Priorities</option>
                  <option value="High-Value" className="bg-[#121216]">High-Value (Red)</option>
                  <option value="Medium" className="bg-[#121216]">Medium (Yellow)</option>
                  <option value="Standard" className="bg-[#121216]">Standard (Blue)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#0B0B0E] px-2.5 py-1.5 rounded-xl border border-[#27272E]">
                <span className="text-gray-400">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-white outline-none cursor-pointer font-medium"
                >
                  <option value="All" className="bg-[#121216]">All Statuses</option>
                  <option value="New" className="bg-[#121216]">New</option>
                  <option value="Contacted" className="bg-[#121216]">Contacted</option>
                  <option value="Booked" className="bg-[#121216]">Booked</option>
                  <option value="Archived" className="bg-[#121216]">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#14141B] text-gray-400 uppercase text-[11px] tracking-wider border-b border-[#27272E]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Client Name</th>
                  <th className="py-3.5 px-4">Event Date</th>
                  <th className="py-3.5 px-4">Event Type</th>
                  <th className="py-3.5 px-4">Priority Tag</th>
                  <th className="py-3.5 px-4">Quote</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F27]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No leads match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-[#181822]/80 transition-colors cursor-pointer group"
                    >
                      {/* Client Name + Phone */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                          {lead.client_name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {lead.client_phone}
                        </div>
                      </td>

                      {/* Event Date */}
                      <td className="py-4 px-4 text-gray-300 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span>{lead.event_date}</span>
                        </div>
                      </td>

                      {/* Event Type */}
                      <td className="py-4 px-4 text-gray-200">
                        <span className="font-medium">{lead.event_type}</span>
                        <span className="text-[11px] text-gray-500 block">
                          ~{lead.guest_count} guests
                        </span>
                      </td>

                      {/* Priority Tag Badge (Required: Red for High-Value, Yellow for Medium, Blue for Standard) */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${priorityBadgeStyle(
                            lead.label
                          )}`}
                        >
                          {lead.label}
                        </span>
                      </td>

                      {/* Calculated Quote */}
                      <td className="py-4 px-4 font-serif font-bold text-white">
                        {formatINR(lead.calculated_quote)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${statusBadgeStyle(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#20202A] group-hover:bg-[#D4AF37] text-gray-300 group-hover:text-black font-semibold text-xs flex items-center gap-1.5 ml-auto transition-all shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Pitch</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-[#111116] border-t border-[#27272E] text-xs text-gray-400 flex items-center justify-between">
            <div>
              Showing <span className="text-white font-medium">{filteredLeads.length}</span> of{' '}
              <span className="text-white font-medium">{leads.length}</span> leads
            </div>
            <div className="text-[11px] text-gray-500">
              Click any row to open the Lead Details Drawer &amp; WhatsApp pitch generator
            </div>
          </div>
        </div>
      </div>

      {/* Manual Walk-In Lead Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-md bg-[#13131A] rounded-2xl border border-[#D4AF37]/30 shadow-luxury p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-white">Add Walk-in / Phone Lead</h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualLeadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={manualForm.client_name}
                  onChange={(e) => setManualForm({ ...manualForm, client_name: e.target.value })}
                  placeholder="e.g. Rohith Varma"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] text-xs outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1">Hyderabad Mobile Phone</label>
                <input
                  type="text"
                  required
                  value={manualForm.client_phone}
                  onChange={(e) => setManualForm({ ...manualForm, client_phone: e.target.value })}
                  placeholder="+91 98490 12345"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] text-xs outline-none text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Event Type</label>
                  <select
                    value={manualForm.event_type}
                    onChange={(e) => setManualForm({ ...manualForm, event_type: e.target.value as EventType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] text-xs outline-none text-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={manualForm.event_date}
                    onChange={(e) => setManualForm({ ...manualForm, event_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] text-xs outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Guest Count</label>
                  <input
                    type="number"
                    value={manualForm.guest_count}
                    onChange={(e) => setManualForm({ ...manualForm, guest_count: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] text-xs outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 font-semibold mb-1">Quote (₹ INR)</label>
                  <input
                    type="number"
                    value={manualForm.quote}
                    onChange={(e) => setManualForm({ ...manualForm, quote: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] text-xs outline-none text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 font-semibold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  placeholder="Notes from call / walk-in..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-[#27272E] focus:border-[#D4AF37] text-xs outline-none text-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-semibold text-xs shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
                >
                  Create &amp; Log Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-out Lead Details Drawer */}
      <LeadDrawer />
    </div>
  );
};
