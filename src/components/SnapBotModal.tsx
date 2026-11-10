import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Mic,
  MicOff,
  Sparkles,
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { checkGuardrails, STRICT_GUARDRAIL_RESPONSE, getDetailedGuardrailResponse, GUARDRAIL_DEMO_PROMPTS } from '../services/guardrails';
import { EventType, LeadLabel } from '../types/lead';
import { determineLeadLabel, calculateBaseQuote, generateWhatsAppPitch, formatINR, cleanContactInfo } from '../services/leadService';
import { triggerGoldConfetti } from './ui/ConfettiTrigger';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  isGuardrail?: boolean;
  guardrailBadge?: string;
}

type Step = 'name' | 'phone' | 'event_type' | 'custom_event_name' | 'event_date' | 'guest_count' | 'addons' | 'completed';

export const SnapBotModal: React.FC = () => {
  const {
    isSnapBotOpen,
    setIsSnapBotOpen,
    preselectedPackage,
    addLead,
    setActiveView,
    showToast,
  } = useLeads();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [isTyping, setIsTyping] = useState(false);
  const [showGuardrailMenu, setShowGuardrailMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialInquiries, setSpecialInquiries] = useState<string[]>([]);

  // Collected Lead data
  const [leadData, setLeadData] = useState<{
    name: string;
    phone: string;
    email?: string;
    eventType: EventType;
    customEventName?: string;
    eventDate: string;
    guestCount: number;
    quote: number;
    label: LeadLabel;
  }>({
    name: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    customEventName: '',
    eventDate: '',
    guestCount: 300,
    quote: 150000,
    label: 'High-Value',
  });

  const [completedLeadSummary, setCompletedLeadSummary] = useState<{
    summary: string;
    quote: number;
    label: LeadLabel;
    leadId?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startConversation = () => {
    const greeting =
      "Namaste! I'm SnapBot, your virtual concierge for PixelStory Studios. Let's find the perfect photography package for your special day. May I know your name first?";

    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: greeting,
        timestamp: new Date(),
      },
    ]);

    if (preselectedPackage) {
      if (preselectedPackage.toLowerCase().includes('traditional') || preselectedPackage.toLowerCase().includes('gold')) {
        setLeadData((prev) => ({ ...prev, eventType: 'Wedding', customEventName: '' }));
      } else if (preselectedPackage.toLowerCase().includes('candid') || preselectedPackage.toLowerCase().includes('platinum')) {
        setLeadData((prev) => ({ ...prev, eventType: 'Wedding', customEventName: '' }));
      } else if (preselectedPackage.toLowerCase().includes('pre-wedding') || preselectedPackage.toLowerCase().includes('outdoor')) {
        setLeadData((prev) => ({ ...prev, eventType: 'Pre-Wedding', customEventName: '' }));
      }
    }

    setCurrentStep('name');
    setCompletedLeadSummary(null);
    setSelectedAddons([]);
    setSpecialInquiries([]);
    setLeadData({
      name: '',
      phone: '',
      email: '',
      eventType: 'Wedding',
      customEventName: '',
      eventDate: '',
      guestCount: 300,
      quote: 150000,
      label: 'High-Value',
    });
  };

  useEffect(() => {
    if (isSnapBotOpen && messages.length === 0) {
      startConversation();
    }
  }, [isSnapBotOpen]);

  const handleResetChat = () => {
    setMessages([]);
    setCurrentStep('name');
    setCompletedLeadSummary(null);
    setSelectedAddons([]);
    setSpecialInquiries([]);
    startConversation();
  };

  const addBotMessage = (text: string, isGuardrail = false, delayMs = 600, guardrailBadge?: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text,
          timestamp: new Date(),
          isGuardrail,
          guardrailBadge,
        },
      ]);
    }, delayMs);
  };

  const toggleVoiceInput = () => {
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };
    const SpeechRec = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRec) {
      showToast('Speech recognition not supported in this browser. Please type your message.', 'warning');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak now 🎙️', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        showToast(`Heard: "${transcript}"`, 'success');
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Could not hear clearly. Please try typing.', 'warning');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Voice error:', err);
      setIsListening(false);
    }
  };

  const handleUserSubmit = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Check Guardrail Policy with domain-tailored answers
    const guardrailCheck = checkGuardrails(text);
    if (guardrailCheck.triggered) {
      const detailedAnswer = getDetailedGuardrailResponse(guardrailCheck, leadData.name);
      
      const badgeText = 
        guardrailCheck.category === 'travel'
          ? '✈️ Destination Travel Policy • Lead Director Review'
          : guardrailCheck.category === 'equipment'
          ? '🎥 Custom Cinema Rig Policy • Technical Director Review'
          : guardrailCheck.category === 'multiday'
          ? '🗓️ Multi-Day Bespoke Itinerary • Studio Director Review'
          : '💎 Transparent Luxury Pricing Policy • Studio Director Review';

      addBotMessage(detailedAnswer, true, 500, badgeText);

      // Track inquiry in specialInquiries list
      const reason = guardrailCheck.reason || guardrailCheck.category || 'Special Custom Request';
      setSpecialInquiries((prev) => (prev.includes(reason) ? prev : [...prev, reason]));

      // Do NOT leave the user stranded! Seamlessly bridge to the next lead capture prompt:
      setTimeout(() => {
        if (currentStep === 'name') {
          addBotMessage(`To help Director Srikanth prepare your customized proposal, may I know your name first?`, false, 600);
        } else if (currentStep === 'phone') {
          addBotMessage(`Could you please share your WhatsApp number or email ID so we can send you our portfolio deck?`, false, 600);
        } else if (currentStep === 'event_type') {
          addBotMessage(`What type of event are you celebrating? (Wedding, Pre-Wedding, Birthday, Corporate, or Other)`, false, 600);
        } else if (currentStep === 'custom_event_name') {
          addBotMessage(`Could you tell me the specific celebration name (e.g. Half-Saree, Housewarming, Anniversary)?`, false, 600);
        } else if (currentStep === 'event_date') {
          addBotMessage(`When is your planned celebration date? (e.g. 2026-12-14 or December 14)`, false, 600);
        } else if (currentStep === 'guest_count') {
          addBotMessage(`Approximately how many guests are you expecting at the venue?`, false, 600);
        } else if (currentStep === 'addons') {
          addBotMessage(`Do you have any signature add-on preferences like 4K Drone, Extra Royal Album for In-Laws, or Same-Day LED Wall edit?`, false, 600);
        }
      }, 1200);

      return;
    }

    processStepInput(text);
  };

  const processStepInput = (input: string) => {
    if (currentStep === 'name') {
      const cleanName = input.replace(/^(my name is|i am|this is)\s*/i, '').trim();
      setLeadData((prev) => ({ ...prev, name: cleanName }));
      setCurrentStep('phone');
      // Prompt explicitly asks for mail id or phone number:
      addBotMessage(
        `Wonderful to connect with you, ${cleanName}! 📸 Could you please share your WhatsApp / phone number or email ID so we can share package portfolios?`
      );
      return;
    }

    if (currentStep === 'phone') {
      const contact = cleanContactInfo(input);
      setLeadData((prev) => ({
        ...prev,
        phone: contact.phone,
        email: contact.email || prev.email,
      }));
      setCurrentStep('event_type');
      addBotMessage(
        `Got it! What type of event are you planning? (Wedding, Pre-Wedding, Birthday, Corporate, or Other)`
      );
      return;
    }

    if (currentStep === 'event_type') {
      const lower = input.toLowerCase().trim();

      if (lower.includes('pre-wedding') || lower.includes('pre wedding') || lower.includes('outdoor')) {
        setLeadData((prev) => ({ ...prev, eventType: 'Pre-Wedding', customEventName: '' }));
        setCurrentStep('event_date');
        addBotMessage(
          `Splendid! A Pre-Wedding celebration. When is your planned event date? (e.g. 2026-12-14 or December 14)`
        );
        return;
      }

      if (lower.includes('birthday')) {
        setLeadData((prev) => ({ ...prev, eventType: 'Birthday', customEventName: '' }));
        setCurrentStep('event_date');
        addBotMessage(
          `Splendid! A Birthday celebration. When is your planned event date? (e.g. 2026-12-14 or December 14)`
        );
        return;
      }

      if (lower.includes('corporate') || lower.includes('conference') || lower.includes('summit') || lower.includes('seminar')) {
        setLeadData((prev) => ({ ...prev, eventType: 'Corporate', customEventName: '' }));
        setCurrentStep('event_date');
        addBotMessage(
          `Splendid! A Corporate celebration. When is your planned event date? (e.g. 2026-12-14 or December 14)`
        );
        return;
      }

      if (lower.includes('wedding') || lower.includes('marriage') || lower.includes('reception')) {
        setLeadData((prev) => ({ ...prev, eventType: 'Wedding', customEventName: '' }));
        setCurrentStep('event_date');
        addBotMessage(
          `Splendid! A Wedding celebration. When is your planned event date? (e.g. 2026-12-14 or December 14)`
        );
        return;
      }

      // If user selected or typed "Other" / "Others"
      if (lower === 'other' || lower === 'others' || lower === 'other event' || lower === 'something else') {
        setLeadData((prev) => ({ ...prev, eventType: 'Other', customEventName: '' }));
        setCurrentStep('custom_event_name');
        addBotMessage(
          `Wonderful! PixelStory Studios crafts bespoke cinematography for all special milestones. 🌟\nCould you please tell me what kind of event you're celebrating? (e.g. Housewarming, Half-Saree, Baby Shower, Anniversary, Fashion Shoot)`
        );
        return;
      }

      // If the user typed a specific celebration directly (e.g. "Housewarming", "Half-Saree", "Anniversary")
      const customName = input.trim();
      const article = /^[aeiou]/i.test(customName) ? 'An' : 'A';
      setLeadData((prev) => ({ ...prev, eventType: 'Other', customEventName: customName }));
      setCurrentStep('event_date');
      addBotMessage(
        `Splendid! ${article} ${customName} celebration. When is your planned event date? (e.g. 2026-12-14 or December 14)`
      );
      return;
    }

    if (currentStep === 'custom_event_name') {
      const cleanCustom = input.replace(/^(it is|it's|we have|an|a)\s*/i, '').trim();
      const finalCustomName = cleanCustom || 'Special Celebration';
      const article = /^[aeiou]/i.test(finalCustomName) ? 'An' : 'A';
      setLeadData((prev) => ({
        ...prev,
        eventType: 'Other',
        customEventName: finalCustomName,
      }));
      setCurrentStep('event_date');
      addBotMessage(
        `Splendid! ${article} ${finalCustomName} celebration. When is your planned event date? (e.g. 2026-12-14 or December 14)`
      );
      return;
    }

    if (currentStep === 'event_date') {
      const cleanDate = input.trim();
      setLeadData((prev) => ({ ...prev, eventDate: cleanDate }));
      setCurrentStep('guest_count');
      addBotMessage(
        `Thank you. Approximately how many guests are you expecting at the venue?`
      );
      return;
    }

    if (currentStep === 'guest_count') {
      const parsedCount = parseInt(input.replace(/[^0-9]/g, ''), 10) || 300;
      setLeadData((prev) => ({ ...prev, guestCount: parsedCount }));
      setCurrentStep('addons');
      addBotMessage(
        `Do you have any signature add-on preferences like 4K Drone, Extra Royal Album for In-Laws, or Same-Day LED Wall edit? (Select below or say 'None')`
      );
      return;
    }

    if (currentStep === 'addons') {
      let finalAddons = [...selectedAddons];
      if (input.toLowerCase() !== 'none' && input.toLowerCase() !== 'skip' && !finalAddons.includes(input)) {
        finalAddons.push(input);
      }
      finishLeadCollection(leadData.guestCount, finalAddons);
      return;
    }

    addBotMessage(
      `Thank you again, ${leadData.name}! Our team has received your inquiry for ${leadData.eventDate}. Feel free to ask any other standard question.`
    );
  };

  const finishLeadCollection = async (guests: number, addons: string[]) => {
    setCurrentStep('completed');
    setIsTyping(true);

    const eventType = leadData.eventType;
    const customName = leadData.customEventName;
    const friendlyEventName = customName || eventType;
    const name = leadData.name;
    const date = leadData.eventDate;
    const phone = leadData.phone;
    const email = leadData.email;

    const isLuxury = eventType === 'Wedding' || guests >= 500;
    const calculatedQuote = calculateBaseQuote(eventType, isLuxury ? 'Platinum' : 'Gold', addons);
    const label = determineLeadLabel(eventType);

    const addonPhrase = addons.length > 0 ? ` Addons requested: ${addons.join(', ')}.` : '';
    const specialPhrase = specialInquiries.length > 0 ? ` Special Inquiries: ${specialInquiries.join('; ')}.` : '';

    const chatSummary = `Exclusive ${friendlyEventName} celebration for ~${guests} guests on ${date}.\nClient requested ${
      isLuxury ? 'Platinum luxury coverage with 4K cinema & candid team' : 'Gold standard coverage package'
    }.${addonPhrase}${specialPhrase}`;

    const whatsappDraft = generateWhatsAppPitch({
      client_name: name,
      event_type: eventType,
      custom_event_name: customName,
      event_date: date,
      calculated_quote: calculatedQuote,
      chat_summary: chatSummary,
      selected_addons: addons,
    });

    const finalEndingMessage = `Thank you, ${name}! We are checking our camera schedules for ${date}. Our studio will reach out to you shortly.`;

    const quoteMessage = `Based on your ${friendlyEventName} details${addons.length > 0 ? ` and selected upgrades` : ''}, your total investment quote is ${formatINR(
      calculatedQuote
    )} (${isLuxury ? 'Platinum Luxury Package' : 'Gold Standard Package'}).`;

    setTimeout(async () => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: quoteMessage,
          timestamp: new Date(),
        },
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: finalEndingMessage,
          timestamp: new Date(),
        },
      ]);

      // Fire celebratory royal gold confetti on quote generation
      triggerGoldConfetti();

      try {
        const created = await addLead({
          client_name: name,
          client_phone: phone,
          client_email: email,
          event_type: eventType,
          custom_event_name: customName,
          event_date: date,
          guest_count: guests,
          chat_summary: chatSummary,
          label: label,
          status: 'New',
          calculated_quote: calculatedQuote,
          whatsapp_draft: whatsappDraft,
          selected_addons: addons,
          notes: [
            customName ? `Celebration: ${customName}` : '',
            email ? `Client Email: ${email}` : '',
            specialInquiries.length > 0 ? `Special Requests: ${specialInquiries.join('; ')}` : '',
            'Captured via SnapBot with Guardrail validation',
          ]
            .filter(Boolean)
            .join(' | '),
        });

        setCompletedLeadSummary({
          summary: chatSummary,
          quote: calculatedQuote,
          label: label,
          leadId: created.id,
        });
      } catch (err) {
        console.error('Failed to auto-save lead:', err);
      }
    }, 800);
  };

  const handleQuickChipSelect = (value: string) => {
    handleUserSubmit(value);
  };

  const handleToggleAddonChip = (addonName: string) => {
    if (selectedAddons.includes(addonName)) {
      setSelectedAddons((prev) => prev.filter((a) => a !== addonName));
    } else {
      setSelectedAddons((prev) => [...prev, addonName]);
    }
  };

  if (!isSnapBotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full sm:max-w-lg h-[92vh] sm:h-[680px] bg-[#101014] rounded-t-3xl sm:rounded-2xl border border-[#D4AF37]/30 shadow-luxury flex flex-col overflow-hidden text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#14141A] border-b border-[#27272E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-black font-bold shadow-gold-sm">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#14141A] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base text-white">SnapBot Concierge</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  AI Guardrails Active
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                PixelStory Studios • Voice &amp; Email Lead AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="Reset Conversation"
              className="p-2 rounded-lg bg-[#1E1E26] hover:bg-[#2A2A35] text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSnapBotOpen(false)}
              className="p-2 rounded-lg bg-[#1E1E26] hover:bg-[#2A2A35] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Judges / Demo Guardrail Test Bar */}
        <div className="px-4 py-2 bg-[#171720] border-b border-[#27272E] text-xs">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowGuardrailMenu(!showGuardrailMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Hackathon Guardrail Tester {showGuardrailMenu ? '▲' : '▼'}</span>
            </button>
            <span className="text-[10px] text-gray-400">Click to test non-negotiation rule</span>
          </div>

          {showGuardrailMenu && (
            <div className="mt-2.5 pt-2 border-t border-[#27272E] grid grid-cols-2 gap-2">
              {GUARDRAIL_DEMO_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleUserSubmit(item.prompt);
                    setShowGuardrailMenu(false);
                  }}
                  className="text-left p-2 rounded-lg bg-[#22222E] hover:bg-[#2C2C3C] border border-[#3A3A4A] hover:border-[#D4AF37]/50 transition-colors text-[11px] text-gray-200"
                >
                  <div className="font-semibold text-[#D4AF37] truncate">{item.label}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">{item.category}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-[#1F1F28] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#D4AF37]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-medium shadow-md rounded-br-xs'
                    : msg.isGuardrail
                    ? 'bg-[#2A1810] border border-amber-500/50 text-amber-100 shadow-md rounded-bl-xs'
                    : 'bg-[#181820] border border-[#27272E] text-gray-200 shadow-inner rounded-bl-xs'
                }`}
              >
                {msg.isGuardrail && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{msg.guardrailBadge || 'Enforced Guardrail Response'}</span>
                  </div>
                )}
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-black/60 text-right' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 mt-0.5 text-[#D4AF37]">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 text-xs italic p-2">
              <div className="w-6 h-6 rounded-full bg-[#181820] flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37]">
                <Bot className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <span>SnapBot is checking studio camera schedules...</span>
            </div>
          )}

          {/* Chat Complete Card Preview */}
          {completedLeadSummary && (
            <div className="my-3 p-4 rounded-xl bg-[#141E16] border border-emerald-500/50 shadow-luxury text-emerald-100 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lead Logged in Database</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  {completedLeadSummary.label}
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-200 whitespace-pre-line bg-black/40 p-2.5 rounded-lg border border-emerald-500/20">
                {completedLeadSummary.summary}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Calculated Quote</span>
                  <span className="font-serif text-lg font-bold text-[#D4AF37]">
                    {formatINR(completedLeadSummary.quote)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsSnapBotOpen(false);
                    setActiveView('admin');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C048] text-black text-xs font-semibold flex items-center gap-1 shadow-gold-sm transition-all"
                >
                  <span>View in Admin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips based on step */}
        {currentStep === 'event_type' && (
          <div className="px-4 py-2 bg-[#14141C] border-t border-[#27272E] flex flex-wrap gap-2">
            {(['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Other'] as EventType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleQuickChipSelect(type)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1E1E28] hover:bg-[#D4AF37] hover:text-black border border-[#333342] hover:border-[#D4AF37] transition-all"
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {currentStep === 'custom_event_name' && (
          <div className="px-4 py-2 bg-[#14141C] border-t border-[#27272E] flex flex-wrap gap-2 animate-fadeIn">
            {[
              'Half-Saree Ceremony',
              'Housewarming (Gruhapravesam)',
              'Baby Shower (Seemantham)',
              '25th / 50th Silver Anniversary',
              'Fashion & Portfolio Shoot',
              'Engagement / Ring Ceremony',
            ].map((customOption) => (
              <button
                key={customOption}
                onClick={() => handleQuickChipSelect(customOption)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1E1E28] hover:bg-[#D4AF37] hover:text-black border border-[#333342] hover:border-[#D4AF37] transition-all"
              >
                {customOption}
              </button>
            ))}
          </div>
        )}

        {currentStep === 'guest_count' && (
          <div className="px-4 py-2 bg-[#14141C] border-t border-[#27272E] flex flex-wrap gap-2">
            {['100 guests', '300 guests', '600 guests', '1000+ guests'].map((cnt) => (
              <button
                key={cnt}
                onClick={() => handleQuickChipSelect(cnt)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1E1E28] hover:bg-[#D4AF37] hover:text-black border border-[#333342] hover:border-[#D4AF37] transition-all"
              >
                {cnt}
              </button>
            ))}
          </div>
        )}

        {currentStep === 'addons' && (
          <div className="px-4 py-2 bg-[#14141C] border-t border-[#27272E] space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {['4K Aerial Drone', 'Royal Album for In-Laws', 'Same-Day LED Reel', '360 Spin Booth'].map((addon) => {
                const isSelected = selectedAddons.includes(addon);
                return (
                  <button
                    key={addon}
                    onClick={() => handleToggleAddonChip(addon)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-semibold'
                        : 'bg-[#1E1E28] text-gray-300 border-[#333342] hover:border-[#D4AF37]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {addon}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-gray-400">
                {selectedAddons.length > 0 ? `${selectedAddons.length} upgrades chosen` : 'No upgrades chosen'}
              </span>
              <button
                onClick={() => processStepInput(selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None')}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-semibold text-xs shadow-gold-sm"
              >
                Confirm Upgrades &amp; Get Quote ➔
              </button>
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSubmit();
          }}
          className="p-3 sm:p-4 bg-[#14141A] border-t border-[#27272E] flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening... click to stop' : 'Click to speak in English/Hindi'}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse border-red-400 shadow-md'
                : 'bg-[#1B1B24] text-gray-400 hover:text-[#D4AF37] border-[#2C2C38] hover:border-[#D4AF37]/40'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : currentStep === 'name'
                ? 'Type or speak your name...'
                : currentStep === 'phone'
                ? 'Type WhatsApp number or Email ID (e.g. name@gmail.com)...'
                : currentStep === 'custom_event_name'
                ? 'Type celebration name (e.g. Half-Saree, Housewarming, Anniversary)...'
                : currentStep === 'event_date'
                ? 'Type event date (e.g. 2026-12-14)...'
                : 'Ask SnapBot a question or enter details...'
            }
            className="flex-1 px-4 py-3 rounded-xl bg-[#0F0F13] border border-[#27272E] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-xs sm:text-sm text-white placeholder-gray-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-gold-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
