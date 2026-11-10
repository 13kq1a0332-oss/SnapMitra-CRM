import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  Award,
  ShieldCheck,
  Film,
  Calculator,
  Camera,
  Star,
  Quote,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Play,
  Sliders,
  Eye,
  Flame,
  MapPin,
  Volume2,
  VolumeX,
  Zap,
  Clock,
  Compass,
  Layers,
  Crown,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { GoldenParticlesCanvas } from './ui/GoldenParticlesCanvas';
import { SpotlightCard } from './ui/SpotlightCard';
import { MagneticButton } from './ui/MagneticButton';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { InfiniteMarquee } from './ui/InfiniteMarquee';
import { triggerGoldConfetti } from './ui/ConfettiTrigger';

interface BackgroundSlide {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  url: string;
  focalPoint?: string;
}

const LUXURY_SLIDES: BackgroundSlide[] = [
  {
    id: 1,
    title: 'The Nizam Royal Union',
    subtitle: 'Atmospheric & Luxury Candlelight',
    tagline: 'Warm candlelight, deep shadows & champagne gold highlights at Falaknuma',
    url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 35%',
  },
  {
    id: 2,
    title: 'Sacred Vedic Muhurtham & Mandap Fire',
    subtitle: 'Sacred Rituals & Deep Marigold Blossoms',
    tagline: 'Traditional Vedic pheras, sacred fire embers, and gold temple jewelry',
    url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 40%',
  },
  {
    id: 3,
    title: 'Royal Heritage Bridal Elegance',
    subtitle: 'Kanjeevaram Saree & Heritage Gold',
    tagline: 'Intricate temple gold jewelry, jasmine blossoms, and regal bridal poise',
    url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 25%',
  },
  {
    id: 4,
    title: 'Candid Golden Hour Sunset Cinematography',
    subtitle: 'Motion & Sunset Golden Light',
    tagline: 'Warm lens flares, dynamic emotional couple storytelling & Hollywood color grading',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 35%',
  },
  {
    id: 5,
    title: 'Grand Sangeet & Reception Celebration',
    subtitle: 'Starlight Ballroom & Cold Pyro Sparks',
    tagline: 'Starlight ballroom ceiling, cold pyros, and electric Telugu musical celebration',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 45%',
  },
  {
    id: 6,
    title: 'Pre-Wedding Romantic Outdoor Hills',
    subtitle: 'Mist Contrast & Scenic Vistas',
    tagline: 'Soft natural daylight, pine hills at Ananthagiri and timeless editorial portraiture',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 35%',
  },
  {
    id: 7,
    title: 'Sacred Mangal Sutra & Handcrafted Gold',
    subtitle: 'Deep Reds & Royal Heritage Detail',
    tagline: 'Close-up of sacred Telugu wedding jewelry, mehendi, and raw familial emotion',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 50%',
  },
  {
    id: 8,
    title: 'Production Cinema Rig & Prime Glass',
    subtitle: 'Cinema Line Cameras & 4K Drones',
    tagline: 'Matte black Sony FX6 & FX3 cinema bodies with G-Master prime lenses',
    url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=1920&auto=format&fit=crop',
    focalPoint: 'center 50%',
  },
];

interface PortfolioGalleryItem {
  id: string;
  title: string;
  location: string;
  gear: string;
  image: string;
  description: string;
}

const GALLERY_SHOWCASE: PortfolioGalleryItem[] = [
  {
    id: 'falaknuma',
    title: 'The Nizam Royal Palace Union',
    location: 'Taj Falaknuma Palace, Hyderabad',
    gear: 'Sony FX6 & FX3 • Master 85mm f/1.4 • DJI Inspire 3 8K',
    image: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200&auto=format&fit=crop',
    description: 'A grand Telugu royal celebration overlooking the City of Pearls, captured with cinematic color grading.',
  },
  {
    id: 'mandap-fire',
    title: 'The Sacred Vedic Muhurtham',
    location: 'Jubilee Hills Heritage Mandap',
    gear: 'Dual Sony FX6 • 50mm f/1.2 GM • Calibrated Ambient Cine Lights',
    image: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=1200&auto=format&fit=crop',
    description: 'Sacred Vedic pheras, marigold blossoms, and emotional parent blessings documented in 10-bit raw S-Log3.',
  },
  {
    id: 'bridal-heritage',
    title: 'Royal Heritage Bridal Elegance',
    location: 'Chowmahalla Palace Courtyard',
    gear: 'Sony A7R V • G-Master 85mm f/1.4 • High-Dynamic Range Lighting',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=1200&auto=format&fit=crop',
    description: 'Kanjeevaram silk drape, heirloom temple gold jewelry, and royal bridal poise documented with medium-format sharpness.',
  },
  {
    id: 'ananthagiri',
    title: 'Sunset Mist Romance',
    location: 'Ananthagiri Hills, Vikarabad',
    gear: 'Canon Cinema EOS • Anamorphic Primes • 4K Drone Fleet',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    description: 'Golden-hour couple portraiture framed against pine trees and mist-draped hilltops.',
  },
  {
    id: 'sangeet-starlight',
    title: 'Grand Sangeet & Reception',
    location: 'Novotel HICC Grand Ballroom',
    gear: 'Multi-cam Cinema Rig • Cold Pyro Sync • Wireless Audio Capture',
    image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop',
    description: 'High-energy musical dance choreography and starlight ceiling celebrations covered with dynamic gimbal tracking.',
  },
  {
    id: 'prewedding',
    title: 'Outdoor Scenic Harmony',
    location: 'Ramoji Film City & Golconda',
    gear: 'Sony A7IV • 50mm f/1.2 GM • Gimbal 3-Axis Stabilizer',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    description: 'Romantic couple frames crafted in Hyderabad with high-fashion lighting and color grading.',
  },
];

const PRESTIGIOUS_VENUES = [
  { name: 'Taj Falaknuma Palace', area: 'Old City, Hyderabad', count: '120+ Weddings' },
  { name: 'Novotel Hyderabad Convention Centre', area: 'Hitec City', count: '95+ Receptions' },
  { name: 'Fort Grand Shamshabad', area: 'Airport Road', count: '80+ Celebrations' },
  { name: 'Ramoji Film City', area: 'Grand Sets', count: '70+ Pre-Weddings' },
  { name: 'ITC Kohenur', area: 'Knowledge City', count: '60+ Sangeets' },
  { name: 'The Golkonda Resort & Spa', area: 'Gandipet Lake', count: '85+ Destination Shoots' },
];

const TESTIMONIALS = [
  {
    quote: "PixelStory Studios immortalized our Taj Falaknuma wedding! The candid cinema film made everyone tear up. The SnapBot quote was exact, zero hidden fees.",
    couple: "Siddharth & Ananya Reddy",
    venue: "Taj Falaknuma Palace, Hyderabad",
    rating: 5,
    tag: "Verified Falaknuma Couple",
  },
  {
    quote: "From our sunrise pre-wedding at Ananthagiri to the grand reception at Novotel HICC, Vikram's team worked with incredible warmth and perfection.",
    couple: "Vikram & Sneha Varma",
    venue: "Novotel HICC Hyderabad",
    rating: 5,
    tag: "Verified 2-Day Celebration",
  },
  {
    quote: "The live drone stream and same-day teaser reel were mind-blowing. Our guests were stunned by the film quality. Truly Hyderabad's finest studio.",
    couple: "Rajesh & Priya Kulkarni",
    venue: "Jubilee Hills, Hyderabad",
    rating: 5,
    tag: "Verified Muhurtham",
  },
];

const FAQS = [
  {
    q: "How far in advance should we reserve our Hyderabad wedding date?",
    a: "Because auspicious Telugu Muhurtham dates have exceptionally high demand, most couples book 4 to 8 months in advance. We recommend locking your date with a 40% token as soon as your venue (e.g. Taj Falaknuma, Novotel HICC, Ramoji) is confirmed.",
  },
  {
    q: "Do you travel outside Hyderabad for destination shoots?",
    a: "Yes! While our primary flagship studio is located in Jubilee Hills, Hyderabad, our master crew frequently documents destination weddings across Goa, Udaipur, Vizag, and Bangalore. For destination events, our lead photographer provides a customized travel schedule.",
  },
  {
    q: "When do we receive our edited cinema teasers and albums?",
    a: "You receive a 48-Hour Rapid Sneak Peek Teaser for Instagram and family sharing. Full color-graded 4K cinematic films and handcrafted royal leather albums are delivered within 30–45 business days.",
  },
  {
    q: "What production gear does PixelStory Studios use?",
    a: "We shoot exclusively on Sony Cinema Line cameras (FX6, FX3) and G-Master prime lenses, paired with licensed DJI 4K drone aerials, multi-track audio engineering, and calibrated ambient lighting.",
  },
];

const LIVE_STUDIO_TICKERS = [
  { text: 'Couple from Jubilee Hills reserved Platinum Cinema for Taj Falaknuma (Dec 2026)', time: 'Just now', icon: '🏰' },
  { text: 'Sneak Peek 4K Teaser delivered for Grand Telugu Muhurtham at Novotel HICC', time: '2 hours ago', icon: '✨' },
  { text: 'Outdoor Pre-Wedding shoot confirmed at Ananthagiri Hills for Vikram & Sneha', time: '4 hours ago', icon: '🌿' },
  { text: '50th Grand Anniversary booked in Banjara Hills with 360 Spin Booth', time: 'Yesterday', icon: '💍' },
];

export const CustomerView: React.FC = () => {
  const { openSnapBotWithPackage, setIsSnapBotOpen, setIsPackageCustomizerOpen } = useLeads();
  const [activeLightbox, setActiveLightbox] = useState<PortfolioGalleryItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Showreel Video Modal state
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [selectedShowreelId, setSelectedShowreelId] = useState('bO_9nZyIolM');

  // Interactive AI Package Matcher state
  const [aiVenue, setAiVenue] = useState<'palace' | 'ballroom' | 'resort'>('palace');
  const [aiScale, setAiScale] = useState<'intimate' | 'grand' | 'royal'>('grand');
  const [aiPriority, setAiPriority] = useState<'cinema' | 'portrait' | 'sameday'>('cinema');

  // Before/After Color Grade Slider position (0 - 100)
  const [gradeSliderPosition, setGradeSliderPosition] = useState(55);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Real-time Social Proof Ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerDismissed, setIsTickerDismissed] = useState(false);

  // Interactive Muhurtham Slot Checker state
  const [selectedMuhurthamDate, setSelectedMuhurthamDate] = useState('2026-12-14');

  const MUHURTHAM_DATES = [
    { date: '2026-11-22', label: 'Nov 22, 2026', title: 'Kartika Masam Muhurtham', slots: 1, status: 'Limited' },
    { date: '2026-12-14', label: 'Dec 14, 2026', title: 'Margashira Pournami (Peak)', slots: 1, status: '1 Slot Left' },
    { date: '2026-12-22', label: 'Dec 22, 2026', title: 'Winter Grand Auspicious', slots: 2, status: 'Available' },
    { date: '2027-01-18', label: 'Jan 18, 2027', title: 'Post-Sankranti Muhurtham', slots: 2, status: 'Available' },
    { date: '2027-02-08', label: 'Feb 08, 2027', title: 'Magha Masam Royal Union', slots: 1, status: 'High Demand' },
  ];

  const currentMuhurthamInfo = MUHURTHAM_DATES.find((d) => d.date === selectedMuhurthamDate) || MUHURTHAM_DATES[1];

  const ownerPhone = '8497980957';
  const ownerWhatsAppUrl = `https://wa.me/91${ownerPhone}?text=${encodeURIComponent('Hi PixelStory Studios, I would like to inquire about wedding/event photography packages.')}`;
  const ownerEmail = 'Srikanthmallavarapu14@gmail.com';
  const ownerMailtoUrl = `mailto:${ownerEmail}?subject=${encodeURIComponent('PixelStory Studios Photography Inquiry')}`;

  // Automated background slides advancement
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % LUXURY_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Social proof ticker interval
  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_STUDIO_TICKERS.length);
    }, 6500);
    return () => clearInterval(tickerTimer);
  }, []);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % LUXURY_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + LUXURY_SLIDES.length) % LUXURY_SLIDES.length);
  };

  // Dynamic AI computation based on interactive choices
  const computeAiRecommendation = () => {
    if (aiVenue === 'palace' || aiScale === 'royal') {
      return {
        tier: 'Platinum Luxury Masterpiece',
        price: '₹1,50,000',
        numericPrice: 150000,
        crew: '4 Cinema Directors + 2 Candid Photo Artists + 1 4K Drone Operator + 1 Sound Recordist',
        optics: 'Sony FX6 Cine-EI + FX3 Full-Frame • G-Master 85mm f/1.4 + 50mm f/1.2 • DJI Inspire 3 8K',
        deliverables: '48h Viral Teaser + 45-Min Royal Film + Italian Leather Heirloom Album (250 Pages)',
        palaceFit: 'Calibrated for grand chandeliers, evening Sangeet lighting, and historic palace courtyards.',
      };
    }

    if (aiVenue === 'ballroom' && aiScale === 'grand') {
      return {
        tier: 'Platinum Cinema Package',
        price: '₹1,50,000',
        numericPrice: 150000,
        crew: '2 Cinema Directors + 2 Candid Artists + 1 Aerial Drone Pilot + 1 Lighting Assistant',
        optics: 'Dual Sony A7S III + FX3 • 24-70mm GM II + 70-200mm GM II • Multi-Angle Wireless Rig',
        deliverables: 'Same-Day LED Wall Projection + 35-Min Cinema Film + Premium Royal Gloss Album',
        palaceFit: 'Optimized for high-energy dance performances and ballroom acoustic clarity.',
      };
    }

    return {
      tier: 'Gold Heritage Package',
      price: '₹75,000',
      numericPrice: 75000,
      crew: '2 Master Traditional Photographers + 1 Cinematic Videographer',
      optics: 'Sony A7IV + Prime 50mm f/1.2 + 35mm f/1.4 GM • Calibrated Softbox Lighting',
      deliverables: 'Full Mandap Ceremony Edit + 150-Page Handcrafted Album + High-Res Digital Negatives',
      palaceFit: 'Perfect for intimate family rituals, scenic outdoor lawns, and sacred Muhurtham ceremonies.',
    };
  };

  const aiMatch = computeAiRecommendation();

  const offerings = [
    {
      id: 'traditional-wedding',
      name: 'Traditional Wedding',
      packageTier: 'Gold Package',
      price: '₹75,000',
      badgeColor: 'border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/10',
      image: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Timeless rituals documented with regal authenticity and precision.',
      features: [
        '2 Master Traditional Photographers',
        '1 Cinematic HD Videographer',
        'Full Mandap, Muhurtham & Reception Coverage',
        'Handcrafted 150-Page High-Gloss Royal Album',
        'Raw Uncompressed Footage + Full Ceremony Edit',
        '48-Hour Rapid Sneak Peek Teaser for Family',
      ],
      buttonText: 'Check Gold Package & Availability',
      highlight: false,
    },
    {
      id: 'candid-cinematography',
      name: 'Candid Cinematography',
      packageTier: 'Platinum Package',
      price: '₹1,50,000',
      badgeColor: 'border-[#FFDF73] text-[#0B0B0C] bg-[#D4AF37]',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Our flagship cinematic masterpiece: pure emotion and Hollywood color grading.',
      features: [
        '2 Candid Photo Artists + 2 4K Cinema Directors',
        'Licensed 4K Aerial Drone Coverage (Taj Falaknuma & Resorts)',
        '3-5 Min Cinematic Teaser Film + 45-Min Feature Film',
        'Italian Leather Bound Heirloom Wedding Album (250 Pages)',
        'Dedicated Audio Engineering & Multi-Angle Lighting Crew',
        'Lead Photographer Consultation & Shot Planning Call',
      ],
      buttonText: 'Reserve Platinum Package',
      highlight: true,
    },
    {
      id: 'pre-wedding-shoot',
      name: 'Pre-Wedding & Outdoor Shoots',
      packageTier: 'Custom Base Packages',
      price: 'From ₹50,000 - ₹75,000',
      badgeColor: 'border-purple-400/40 text-purple-300 bg-purple-900/20',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Romantic, high-fashion portraiture at Hyderabad’s most scenic landmarks.',
      features: [
        'Full Day Shoot (Golconda, Ananthagiri Hills or Heritage Palaces)',
        '1 High-Fashion Portrait Photographer + 1 Cinema Videographer',
        '2 Instagram Reels / YouTube 4K Music Video Style Teaser',
        '60 Master-Retouched Magazine Quality Portraits',
        'Creative Concept, Styling & Moodboard Assistance',
        'All High-Resolution RAW & Edited Digital Negatives',
      ],
      buttonText: 'Plan Outdoor Shoot',
      highlight: false,
    },
  ];

  const currentSlide = LUXURY_SLIDES[currentSlideIndex];

  return (
    <div className="min-h-screen bg-[#0B0B0C] pb-28 text-white relative overflow-hidden">
      {/* ============================================================ */}
      {/* LUXURY BACKGROUND SLIDES-WISE CAROUSEL HERO SECTION           */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Dynamic Background Image Layers with Smooth Cross-fade & Focal Framing */}
        {LUXURY_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover ${
                isActive ? 'opacity-100 animate-ken-burns' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                backgroundPosition: slide.focalPoint || 'center 35%',
                backgroundImage: `linear-gradient(to bottom, rgba(11, 11, 12, 0.42) 0%, rgba(11, 11, 12, 0.65) 50%, rgba(11, 11, 12, 0.98) 100%), radial-gradient(circle at 50% 35%, rgba(11, 11, 12, 0.15) 0%, rgba(11, 11, 12, 0.75) 85%), url('${slide.url}')`,
              }}
            />
          );
        })}

        {/* ThreeUI & WebGL-inspired Golden Bokeh Particles & Candlelite Embers */}
        <GoldenParticlesCanvas className="z-[3]" particleCount={55} interactive={true} />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center flex-1 flex flex-col justify-center">
          {/* Realism: Live Auspicious Muhurtham Banner */}
          <div className="flex flex-col items-center gap-2 mb-5 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181824]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] text-[#D4AF37] shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-white font-cinzel tracking-wider text-[10px]">2026 Telugu Muhurtham:</span>
              <span className="text-gray-300">Peak dates (Nov 2026 – Feb 2027) booking • Limited to 2 weddings/weekend</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A22]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium shadow-gold-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-cinzel tracking-widest text-[11px]">Hyderabad’s Premier Luxury Wedding Cinematography</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight sm:leading-tight">
            Where Grand Hyderabad Celebrations Become{' '}
            <span className="italic text-gold-shimmer">
              Immortal Works of Art
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-sans leading-relaxed drop-shadow">
            From Falaknuma palace ceremonies to serene destination pre-weddings, PixelStory Studios crafts 
            masterful frames with zero compromises. Select our signature packages below or chat with 
            <strong className="text-[#D4AF37] font-medium"> SnapBot</strong> for an instant verified quote.
          </p>

          {/* Action Buttons with GSAP Magnetic Physics & Confetti */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton
              magneticStrength={0.22}
              triggerConfettiOnClick={true}
              onClick={() => setIsSnapBotOpen(true)}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-semibold text-xs sm:text-sm shadow-luxury hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
              <span>Chat with SnapBot AI</span>
            </MagneticButton>

            <MagneticButton
              magneticStrength={0.2}
              onClick={() => setIsShowreelOpen(true)}
              className="px-5 py-3.5 rounded-full bg-[#181822]/90 hover:bg-[#232330] text-[#D4AF37] border border-[#D4AF37] font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm hover:scale-105"
            >
              <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span>Watch 2026 Showreel</span>
            </MagneticButton>

            <MagneticButton
              magneticStrength={0.18}
              onClick={() => setIsPackageCustomizerOpen(true)}
              className="px-5 py-3.5 rounded-full bg-[#181822]/90 backdrop-blur-md hover:bg-[#232330] text-gray-200 border border-[#2F2F3D] hover:border-[#D4AF37]/50 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#D4AF37]" />
              <span>Quote Calculator</span>
            </MagneticButton>

            {/* Direct WhatsApp Call Button */}
            <a
              href={ownerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Director: {ownerPhone}</span>
            </a>
          </div>

          {/* GSAP-Powered Animated Numerical Trust Badges */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-300">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hover:border-gold/40 transition-colors">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>
                <AnimatedCounter value={850} suffix="+" className="font-bold text-white text-sm" /> Luxury Celebrations
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hover:border-gold/40 transition-colors">
              <Film className="w-4 h-4 text-[#D4AF37]" />
              <span>4K Cinema Drone Fleet</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hover:border-gold/40 transition-colors">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Zero-Delay Guaranteed Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hover:border-gold/40 transition-colors">
              <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span>
                <AnimatedCounter value={4.9} decimals={1} suffix="★" className="font-bold text-white text-sm" /> Google Reviews (280+ Couples)
              </span>
            </div>
          </div>
        </div>

        {/* Slide Indicators & Navigation Controls */}
        <div className="relative z-10 px-4 sm:px-8 py-4 border-t border-white/10 bg-black/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Current Slide Info */}
          <div className="flex items-center gap-3 text-left">
            <span className="font-mono text-xs text-[#D4AF37] font-bold">
              0{currentSlide.id} / 0{LUXURY_SLIDES.length}
            </span>
            <div className="hidden sm:block border-l border-gray-700 pl-3">
              <span className="text-xs font-semibold text-white block">{currentSlide.title}</span>
              <span className="text-[11px] text-gray-400">{currentSlide.tagline}</span>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {LUXURY_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? 'w-7 bg-[#D4AF37] shadow-gold-sm'
                    : 'w-2 bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              title="Previous Slide"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              title="Next Slide"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 border border-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRESTIGIOUS 5-STAR HYDERABAD VENUES INFINITE MARQUEE         */}
      {/* ============================================================ */}
      <section className="border-y border-[#20202A] bg-[#0E0E12] py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#D4AF37]">
                Official Preferred Cinema Partner • Hyderabad Heritage Landmarks
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono hidden sm:inline-block">
              Hover to pause • 850+ celebrations documented
            </span>
          </div>
        </div>

        <InfiniteMarquee speed="30s">
          {PRESTIGIOUS_VENUES.map((venue, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-xl bg-[#15151D] border border-[#252530] flex items-center gap-3 hover:border-[#D4AF37]/60 hover:bg-[#1A1A24] transition-all cursor-default shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-gray-200 block whitespace-nowrap">
                  {venue.name}
                </span>
                <span className="text-[10px] text-gray-400 block font-mono">
                  {venue.area} • <strong className="text-[#D4AF37] font-semibold">{venue.count}</strong>
                </span>
              </div>
            </div>
          ))}
        </InfiniteMarquee>
      </section>

      {/* ============================================================ */}
      {/* AUSPICIOUS TELUGU MUHURTHAM SLOT AVAILABILITY CHECKER        */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <SpotlightCard
          enableTilt={false}
          borderBeam={true}
          className="p-6 sm:p-8 bg-gradient-to-r from-[#151520] via-[#1A1A26] to-[#151520] border-[#D4AF37]/50 shadow-luxury"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel text-[10px] uppercase font-bold tracking-widest mb-3">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Live 2026–2027 Telugu Muhurtham Calendar</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Verify Auspicious Muhurtham Slot Availability
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 font-sans leading-relaxed">
                Because Telugu wedding dates have peak regional demand, PixelStory Studios strictly limits bookings to{' '}
                <strong className="text-[#D4AF37]">2 grand celebrations per weekend</strong> to ensure undivided master attention.
              </p>
            </div>

            {/* Live Verification Panel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 flex-1 max-w-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Select Auspicious Date:
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentMuhurthamInfo.status}
                </span>
              </div>

              {/* Date Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MUHURTHAM_DATES.map((item) => (
                  <button
                    key={item.date}
                    onClick={() => setSelectedMuhurthamDate(item.date)}
                    className={`px-3 py-2 rounded-xl text-left border transition-all ${
                      selectedMuhurthamDate === item.date
                        ? 'bg-[#222232] border-[#D4AF37] text-white shadow-gold-sm ring-1 ring-[#D4AF37]/50'
                        : 'bg-[#121218] border-[#272733] text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
                  >
                    <span className="font-semibold text-xs text-white block">{item.label}</span>
                    <span className="text-[9px] text-gray-400 truncate block font-sans">{item.title}</span>
                  </button>
                ))}
              </div>

              {/* Status Output & CTA */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex h-2.5 w-2.5 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-gray-200 text-[11px]">
                    <strong className="text-white font-semibold">{currentMuhurthamInfo.slots} Master Crew Slot</strong> available for {currentMuhurthamInfo.label}
                  </span>
                </div>

                <MagneticButton
                  magneticStrength={0.2}
                  triggerConfettiOnClick={true}
                  onClick={() => openSnapBotWithPackage(`Wedding on ${currentMuhurthamInfo.label} (${currentMuhurthamInfo.title})`)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-bold text-xs shadow-gold-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Lock Date with SnapBot</span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* ============================================================ */}
      {/* INTERACTIVE AI WEDDING VISION & PACKAGE MATCHER (AI SPOTLIGHT)*/}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#14141E] to-[#0D0D12] border border-[#D4AF37]/40 shadow-luxury relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Real-Time AI Cinematography Allocator</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Design Your Dream Wedding Film Setup
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              Select your venue style, guest scale, and cinema priorities. Our AI engine dynamically computes your ideal camera crew count, prime lens lineup, and package quote in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Option 1: Venue Style */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-2.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>1. Select Celebration Setting</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'palace', label: '👑 Royal Palace', desc: 'Taj Falaknuma / Chowmahalla' },
                    { id: 'ballroom', label: '🏛️ 5-Star Ballroom', desc: 'Novotel HICC / ITC Kohenur' },
                    { id: 'resort', label: '🌿 Outdoor Lawn', desc: 'Ananthagiri / Golconda Resort' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAiVenue(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        aiVenue === item.id
                          ? 'bg-[#222230] border-[#D4AF37] text-white shadow-gold-sm ring-1 ring-[#D4AF37]/50'
                          : 'bg-[#121218] border-[#252530] text-gray-400 hover:text-white hover:border-[#383848]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{item.label}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Guest Attendance */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>2. Anticipated Guest Scale</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'intimate', label: 'Intimate', count: '~150 - 300 Guests' },
                    { id: 'grand', label: 'Grand Celebration', count: '~500 - 800 Guests' },
                    { id: 'royal', label: 'Mega Royal', count: '1000+ Guests' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAiScale(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        aiScale === item.id
                          ? 'bg-[#222230] border-[#D4AF37] text-white shadow-gold-sm ring-1 ring-[#D4AF37]/50'
                          : 'bg-[#121218] border-[#252530] text-gray-400 hover:text-white hover:border-[#383848]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{item.label}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.count}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Cinematography Priority */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-2.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>3. Key Creative Deliverable Priority</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'cinema', label: '🎥 4K Drone Cinema', desc: 'Teaser + 45-Min Feature Film' },
                    { id: 'portrait', label: '📸 Regal Portraits', desc: 'Handcrafted Royal Albums' },
                    { id: 'sameday', label: '⚡ Same-Day Reels', desc: 'LED Wall Edit for Sangeet' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAiPriority(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        aiPriority === item.id
                          ? 'bg-[#222230] border-[#D4AF37] text-white shadow-gold-sm ring-1 ring-[#D4AF37]/50'
                          : 'bg-[#121218] border-[#252530] text-gray-400 hover:text-white hover:border-[#383848]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{item.label}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Real-time Recommendation Card with 21st.dev Spotlight & Border Beam */}
            <SpotlightCard
              borderBeam={true}
              enableTilt={false}
              className="lg:col-span-5 p-6 rounded-2xl bg-[#171722]/95 border-[#D4AF37]/60 shadow-luxury space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A38] pb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Tailored Recommendation</span>
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-gold-sm">
                  Optimal Match
                </span>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">
                  Recommended Production Tier
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {aiMatch.tier}
                </h3>
                <div className="font-serif text-2xl font-bold text-[#D4AF37] mt-1 flex items-baseline gap-2">
                  <span>{aiMatch.price}</span>
                  <span className="text-xs font-sans text-gray-400 font-normal">All-Inclusive Fixed Quote</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-gray-300 pt-2 border-t border-[#252532]">
                <div>
                  <span className="text-gray-400 block font-semibold mb-0.5">🎬 Assigned Master Crew:</span>
                  <span className="text-white font-medium">{aiMatch.crew}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold mb-0.5">📷 Cinema Gear &amp; Optics:</span>
                  <span className="text-gray-200 font-mono text-[11px]">{aiMatch.optics}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold mb-0.5">📦 Guaranteed Deliverables:</span>
                  <span className="text-gray-200">{aiMatch.deliverables}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-[#D4AF37]">
                  💡 <strong>Venue Optimization:</strong> {aiMatch.palaceFit}
                </div>
              </div>

              <MagneticButton
                magneticStrength={0.2}
                triggerConfettiOnClick={true}
                onClick={() => openSnapBotWithPackage(aiMatch.tier)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-bold text-xs sm:text-sm shadow-gold-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Lock This AI Package with SnapBot</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </MagneticButton>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4K CINEMATIC SHOWREEL FEATURE BENTO CARD                     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div
          onClick={() => setIsShowreelOpen(true)}
          className="group cursor-pointer relative rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-luxury bg-[#0F0F14]"
        >
          <div className="relative h-[280px] sm:h-[400px] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop"
              alt="PixelStory Studios 4K Wedding Showreel"
              className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700 filter brightness-75 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />
            
            {/* Center Pulsing Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-[#D4AF37]/30 animate-ping pointer-events-none" />
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF0BD] flex items-center justify-center text-black shadow-luxury group-hover:scale-110 transition-transform">
                  <Play className="w-7 sm:w-8 h-7 sm:h-8 fill-black text-black ml-1" />
                </div>
              </div>
            </div>

            {/* Badges & Film Info */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-cinzel tracking-wider bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm">
                4K Cinema Line • 10-Bit S-Log3
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-950/80 backdrop-blur-md text-red-300 border border-red-500/40">
                ● 2026 Director Showreel
              </span>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block mb-1 font-cinzel">
                  Taj Falaknuma Palace &amp; Novotel HICC
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Experience The 2026 Cinematography Showreel
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl font-sans">
                  Immerse yourself in our cinematic storytelling, warm golden hour lens flares, and emotional vows captured with Sony Cinema Line bodies.
                </p>
              </div>

              <div className="shrink-0">
                <span className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs flex items-center gap-2 group-hover:bg-[#D4AF37] group-hover:text-black group-hover:border-[#D4AF37] transition-all">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch 4K Reel Player</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SIGNATURE RAW VS. MASTER COLOR GRADE COMPARISON (COLOR CRAFT) */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
            <Sliders className="w-4 h-4" />
            <span>The PixelStory Color Science</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
            From Camera Sensor to Golden Masterpiece
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Every single frame from our Sony Cinema Line cameras is captured in uncompressed 10-bit 4:2:2 S-Log3 and color-graded with warm champagne gold tones, rich royal reds, and radiant Indian skin tones.
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-luxury bg-[#101015]">
          <div
            ref={sliderContainerRef}
            className="relative h-[380px] sm:h-[480px] select-none overflow-hidden cursor-ew-resize group"
            onMouseMove={(e) => {
              if (sliderContainerRef.current) {
                const rect = sliderContainerRef.current.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setGradeSliderPosition(Math.max(5, Math.min(95, pos)));
              }
            }}
            onTouchMove={(e) => {
              if (sliderContainerRef.current && e.touches[0]) {
                const rect = sliderContainerRef.current.getBoundingClientRect();
                const pos = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                setGradeSliderPosition(Math.max(5, Math.min(95, pos)));
              }
            }}
          >
            {/* Background Layer: PixelStory Master Obsidian & Gold Grade */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1920&auto=format&fit=crop')`,
                filter: 'saturate(1.2) contrast(1.15) brightness(1.02)',
              }}
            >
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/50 text-xs font-semibold text-[#D4AF37]">
                ✨ PixelStory Signature Gold Grade
              </div>
            </div>

            {/* Foreground Layer (Clipped): Raw Sony S-Log3 Camera Output */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-75"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1920&auto=format&fit=crop')`,
                clipPath: `inset(0 ${100 - gradeSliderPosition}% 0 0)`,
                filter: 'saturate(0.35) contrast(0.72) brightness(1.12)',
              }}
            >
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-mono text-gray-300">
                📷 Raw Sony S-Log3 Cine-EI (Flat)
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] via-white to-[#D4AF37] shadow-luxury pointer-events-none"
              style={{ left: `${gradeSliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center shadow-lg text-xs">
                ⮂
              </div>
            </div>

            {/* Bottom Slider Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] text-gray-300 pointer-events-none">
              👈 Drag slider to compare Raw S-Log3 vs. Master Color Grade 👉
            </div>
          </div>

          {/* Color Science Specs Bar */}
          <div className="p-4 sm:p-5 bg-[#14141C] border-t border-[#22222E] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div>
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Sensor Capture</span>
              <span className="font-mono text-gray-200">10-Bit 4:2:2 All-Intra</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Color Space</span>
              <span className="font-mono text-gray-200">S-Gamut3.Cine</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Grading Suite</span>
              <span className="font-mono text-[#D4AF37]">DaVinci Resolve Studio</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Dynamic Range</span>
              <span className="font-mono text-[#D4AF37] font-bold">
                <AnimatedCounter value={15} suffix="+" /> Stops Calibrated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Immediate Studio Owner Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171722] via-[#1F1F2C] to-[#171722] border border-[#D4AF37]/30 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                  Need Immediate Date Confirmation or Custom Itinerary?
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Direct Line
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Speak directly with Director Srikanth Mallavarapu for Falaknuma &amp; Hyderabad dates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={ownerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-bold text-xs tracking-wide flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {ownerPhone}</span>
            </a>

            <a
              href={ownerMailtoUrl}
              className="px-4 py-2.5 rounded-xl bg-[#1C1C24] hover:bg-[#282834] border border-[#2F2F3D] text-gray-200 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>Email Studio</span>
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio & Packages Section with 21st.dev Spotlight & ThreeUI 3D Tilt */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span>2026 Production Tier Lineup</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Signature Portfolio Offerings
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Transparent luxury pricing with guaranteed master crew reservation &amp; interactive 3D physics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerings.map((pkg) => (
            <SpotlightCard
              key={pkg.id}
              enableTilt={true}
              borderBeam={pkg.highlight}
              className={`rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative group ${
                pkg.highlight
                  ? 'border-[#D4AF37]/80 shadow-luxury ring-1 ring-[#D4AF37]/50 -translate-y-1'
                  : 'border-[#27272E] hover:border-[#D4AF37]/50'
              }`}
            >
              {pkg.highlight && (
                <div className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black text-[11px] font-bold uppercase tracking-wider py-1 px-4 text-center shadow-gold-sm">
                  ⭐ Studio Masterpiece • Most Requested
                </div>
              )}

              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/30 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md border ${pkg.badgeColor}`}>
                    {pkg.packageTier}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-gray-300 uppercase tracking-widest block font-medium">
                      All-Inclusive Investment
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow">
                      {pkg.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {pkg.tagline}
                  </p>

                  <div className="my-5 border-t border-[#27272E]" />

                  <ul className="space-y-2.5 text-xs text-gray-300">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#27272E]/60 space-y-2">
                  <MagneticButton
                    magneticStrength={0.16}
                    triggerConfettiOnClick={true}
                    onClick={() => openSnapBotWithPackage(pkg.name)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                      pkg.highlight
                        ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5C048] to-[#AA7C11] text-black hover:brightness-110 shadow-gold-sm'
                        : 'bg-[#1F1F26] text-white hover:bg-[#2A2A35] border border-[#2F2F3D] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <span>{pkg.buttonText}</span>
                    <ArrowRight className="w-4 h-4 text-inherit" />
                  </MagneticButton>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* STUDIO PRODUCTION STANDARDS & GEAR SUPERPOWERS BENTO GRID     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1 font-cinzel">
            <Award className="w-4 h-4" />
            <span>The PixelStory Production Standards</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for Timeless Perfection
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-sans">
            Why Hyderabad’s most prominent families entrust their monumental celebrations to our master crew. Zero compromises, zero missed glances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Bento Item 1: Cinema Line Fleet (Wide, 2 cols) */}
          <SpotlightCard enableTilt className="p-6 md:col-span-2 flex flex-col justify-between rounded-2xl bg-[#13131A] border-[#D4AF37]/40 shadow-luxury">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                  Dual Native ISO 800/12800
                </span>
                <Film className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Sony FX6 &amp; FX3 Cinema Line Optics
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                We document your muhurtham rituals using full-frame Sony Cinema Line cameras and G-Master prime glass (50mm f/1.2 &amp; 85mm f/1.4 GM). Delivers unmatched creamy bokeh and crystal-clear low-light performance under candlelight mandaps.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-4 text-xs font-mono text-gray-400">
              <span>✓ 4K 120fps Slow-Mo</span>
              <span>✓ 10-Bit S-Log3</span>
              <span>✓ Uncompressed Raw</span>
            </div>
          </SpotlightCard>

          {/* Bento Item 2: Licensed Aerial Drone */}
          <SpotlightCard enableTilt className="p-6 flex flex-col justify-between rounded-2xl bg-[#13131A] border-white/10 hover:border-[#D4AF37]/50 shadow-luxury">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mb-4">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Licensed 8K &amp; 4K Drone Fleet
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                DGCA-certified drone pilots authorized for aerial sweeps over Taj Falaknuma, Chowmahalla Palace, and destination hillside vistas.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#D4AF37] mt-4 block">
              High-wind dual-stabilizer gimbal
            </span>
          </SpotlightCard>

          {/* Bento Item 3: 48-Hour Rapid Sneak Peek */}
          <SpotlightCard enableTilt className="p-6 flex flex-col justify-between rounded-2xl bg-[#13131A] border-white/10 hover:border-[#D4AF37]/50 shadow-luxury">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-300 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                48-Hour Rapid Sneak Peek
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Never wait months to share your happiness. Receive a 4K 60-second teaser reel for Instagram and WhatsApp within 48 hours of your reception.
              </p>
            </div>
            <span className="text-[11px] font-mono text-amber-300 mt-4 block">
              Viral social media ready edit
            </span>
          </SpotlightCard>

          {/* Bento Item 4: Milan Handcrafted Leather Albums (Wide, 2 cols) */}
          <SpotlightCard enableTilt className="p-6 md:col-span-2 flex flex-col justify-between rounded-2xl bg-[#13131A] border-white/10 hover:border-[#D4AF37]/50 shadow-luxury">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                  200-Year Archival Guarantee
                </span>
                <Camera className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Handcrafted Royal Italian Leather Albums
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Flush-mount, seamless lay-flat albums printed on museum-grade fine art photographic paper. Handcrafted in Milan with genuine Italian Nappa leather covers and embossed 24K gold foil calligraphy.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-4 text-xs font-mono text-gray-400">
              <span>✓ 250 Royal Pages</span>
              <span>✓ Scratch-Resistant Matte Silk</span>
              <span>✓ Heirloom Wooden Chest</span>
            </div>
          </SpotlightCard>

          {/* Bento Item 5: 32-Bit Float Sound */}
          <SpotlightCard enableTilt className="p-6 flex flex-col justify-between rounded-2xl bg-[#13131A] border-white/10 hover:border-[#D4AF37]/50 shadow-luxury">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-300 mb-4">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                32-Bit Float Audio Engineering
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Discrete Sennheiser micro-lavaliers on the bride, groom, and priest ensure sacred Vedic mantras and emotional vows are captured with absolute acoustic perfection. Zero distortion.
              </p>
            </div>
            <span className="text-[11px] font-mono text-purple-300 mt-4 block">
              Multi-channel discrete recording
            </span>
          </SpotlightCard>

          {/* Bento Item 6: Zero-Delay Legal Guarantee */}
          <SpotlightCard enableTilt borderBeam={true} className="p-6 flex flex-col justify-between rounded-2xl bg-[#13131A] border-[#D4AF37]/50 shadow-luxury">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-300 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Zero-Delay Legal Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                We believe in total transparency. Every booking comes with a formal signed contract guaranteeing strict milestone deliveries, or we refund ₹5,000 per day of delay.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-300 mt-4 block">
              100% On-Time Track Record
            </span>
          </SpotlightCard>
        </div>
      </section>

      {/* Real Hyderabad Weddings Showcase (Featuring 6 High-Res URLs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
              <Camera className="w-4 h-4" />
              <span>Cinematic Visual Portfolio</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Real Hyderabad Wedding Stories
            </h2>
          </div>
          <p className="text-xs text-gray-400 max-w-sm">
            Captured across Falaknuma, Ananthagiri, and Jubilee Hills with cinema lenses and 4K aerial drones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GALLERY_SHOWCASE.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#16161E] border border-[#27272E] hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider block">
                    {item.location}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 text-xs text-gray-400">
                <p className="line-clamp-2">{item.description}</p>
                <div className="mt-3 pt-2 border-t border-[#23232D] text-[10px] text-gray-500 font-mono">
                  {item.gear}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] block mb-1">
            Client Stories
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Loved by Hyderabad’s Grandest Families
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <SpotlightCard
              key={idx}
              enableTilt={false}
              className="p-6 rounded-2xl bg-[#14141B]/90 border border-[#27272E] relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    {t.tag}
                  </span>
                </div>
                <Quote className="w-6 h-6 text-[#D4AF37]/30 mb-2" />
                <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#27272E]">
                <h4 className="font-serif font-bold text-sm text-white">{t.couple}</h4>
                <p className="text-[11px] text-gray-400">{t.venue}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Everything you need to know about booking with PixelStory Studios
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#27272E] bg-[#14141A] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#1A1A22] transition-colors"
                >
                  <span className="font-serif font-semibold text-sm sm:text-base text-gray-200">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-gray-400 font-sans leading-relaxed border-t border-[#23232D] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* GRAND EDITORIAL LUXURY FOOTER                                */}
      {/* ============================================================ */}
      <footer className="border-t border-[#22222E] bg-[#08080A] pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
            {/* Column 1: Brand & Bio (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-black border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-gold-sm">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                    PixelStory <span className="text-gold-shimmer italic font-normal">Studios</span>
                  </h3>
                  <span className="font-cinzel text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    Hyderabad's Premier Wedding Cinematography
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed max-w-md">
                Documenting grand Telugu weddings, Falaknuma palace muhurthams, and high-society receptions across Hyderabad, Goa, and Udaipur with Sony Cinema Line bodies and Hollywood color science.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#171720] border border-[#2A2A38] text-gray-300">
                  🏆 WedMeGood Gold 2026
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#171720] border border-[#2A2A38] text-gray-300">
                  ⭐ WeddingSutra SuperStudio
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#171720] border border-[#2A2A38] text-[#D4AF37]">
                  🎥 Sony Alpha Partner
                </span>
              </div>
            </div>

            {/* Column 2: Studio Director Direct Contact (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#D4AF37] block">
                Flagship Studio &amp; Helplines
              </span>

              <div className="space-y-2.5 text-xs text-gray-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Jubilee Hills Flagship Studio:</span>
                    <span className="text-gray-400">Road No. 36, Jubilee Hills, Hyderabad – 500033 (Opp. Neeru's)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Director Srikanth Mallavarapu:</span>
                    <a href={ownerWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-white hover:text-[#25D366] transition-colors">
                      +91 {ownerPhone} (Direct WhatsApp)
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Studio Concierge Email:</span>
                    <a href={ownerMailtoUrl} className="font-mono text-white hover:text-[#D4AF37] transition-colors">
                      {ownerEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Navigation (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#D4AF37] block">
                Studio Portfolios
              </span>

              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <button onClick={() => setIsShowreelOpen(true)} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-[#D4AF37]" />
                    <span>Watch 2026 Showreel</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsSnapBotOpen(true)} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>Instant SnapBot AI Quote</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsPackageCustomizerOpen(true)} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Calculator className="w-3 h-3 text-[#D4AF37]" />
                    <span>Interactive Quote Customizer</span>
                  </button>
                </li>
                <li>
                  <span className="text-gray-500 block pt-1 font-mono text-[11px]">
                    Operating Hours: 10:00 AM – 8:30 PM IST
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Guarantee Bar */}
          <div className="pt-8 border-t border-[#1C1C26] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <div>
              © 2026 PixelStory Studios. All Rights Reserved. Crafted for Grand Hyderabad Celebrations.
            </div>
            <div className="flex items-center gap-4 text-gray-400 font-mono">
              <span>Powered by SnapMitra Lead Engine</span>
              <span>•</span>
              <span className="text-[#D4AF37]">4K Cinema Fleet Guaranteed</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Fullscreen Photo Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-4xl bg-[#121217] rounded-2xl border border-[#D4AF37]/40 shadow-luxury overflow-hidden text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:text-[#D4AF37]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[60vh] overflow-hidden">
              <img
                src={activeLightbox.image}
                alt={activeLightbox.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-2">
              <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                {activeLightbox.location}
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                {activeLightbox.title}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeLightbox.description}
              </p>
              <div className="pt-2 text-xs text-gray-400 font-mono">
                Production Gear: <span className="text-gray-200">{activeLightbox.gear}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4K CINEMATIC SHOWREEL VIDEO MODAL                            */}
      {/* ============================================================ */}
      {isShowreelOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsShowreelOpen(false)}
        >
          <div
            className="w-full max-w-4xl bg-[#0D0D12] rounded-3xl border border-[#D4AF37]/50 shadow-luxury overflow-hidden text-white relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-[#14141C] border-b border-[#252530] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                  PixelStory Studios — 2026 Hyderabad Wedding Cinematography Reel
                </h3>
              </div>
              <button
                onClick={() => setIsShowreelOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player (Responsive 16:9 High-Def Video Stream) */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <iframe
                key={selectedShowreelId}
                className="w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${selectedShowreelId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`}
                title="PixelStory Studios 4K Wedding Cinematography Reel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Showreel Selector Tabs */}
            <div className="px-4 py-2.5 bg-[#101018] border-t border-[#22222E] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                  Showcase Reels:
                </span>
                <button
                  onClick={() => setSelectedShowreelId('bO_9nZyIolM')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedShowreelId === 'bO_9nZyIolM'
                      ? 'bg-[#D4AF37] text-black font-semibold shadow-gold-sm'
                      : 'bg-[#1C1C26] text-gray-300 hover:text-white border border-[#2F2F3E]'
                  }`}
                >
                  🏰 Taj Falaknuma Royal Teaser
                </button>
                <button
                  onClick={() => setSelectedShowreelId('9No-FiEInLA')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedShowreelId === '9No-FiEInLA'
                      ? 'bg-[#D4AF37] text-black font-semibold shadow-gold-sm'
                      : 'bg-[#1C1C26] text-gray-300 hover:text-white border border-[#2F2F3E]'
                  }`}
                >
                  ✨ Telugu Grand Muhurtham Cinema
                </button>
              </div>
            </div>

            {/* Video Footer CTA */}
            <div className="p-4 sm:p-5 bg-[#14141C] border-t border-[#22222E] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-[#D4AF37] font-semibold block">
                  Loved this cinematic visual style?
                </span>
                <span className="text-[11px] text-gray-400">
                  Document your celebration with the exact same directors, Sony Cinema Line bodies, and 4K prime lenses.
                </span>
              </div>
              <button
                onClick={() => {
                  setIsShowreelOpen(false);
                  setIsSnapBotOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-semibold text-xs shadow-gold-sm hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve with SnapBot AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LIVE STUDIO SOCIAL PROOF TICKER (BOTTOM-LEFT PILL)           */}
      {/* ============================================================ */}
      {!isTickerDismissed && (
        <div className="fixed bottom-6 left-6 z-40 hidden md:block animate-fadeIn">
          <div
            onClick={() => setIsSnapBotOpen(true)}
            className="group cursor-pointer p-3 pr-8 rounded-2xl bg-[#14141E]/95 backdrop-blur-md border border-[#D4AF37]/30 shadow-luxury flex items-center gap-3 hover:border-[#D4AF37] transition-all max-w-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-lg shrink-0">
              {LIVE_STUDIO_TICKERS[tickerIndex].icon}
            </div>
            <div className="text-left text-xs">
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
                Live Studio Activity • {LIVE_STUDIO_TICKERS[tickerIndex].time}
              </span>
              <p className="text-gray-200 line-clamp-2 text-[11px] font-sans">
                {LIVE_STUDIO_TICKERS[tickerIndex].text}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsTickerDismissed(true);
              }}
              title="Dismiss notification"
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FLOATING ACTION BUTTON (FAB) AT BOTTOM-RIGHT                  */}
      {/* ============================================================ */}
      <div className="fixed bottom-6 right-6 z-40">
        <MagneticButton
          magneticStrength={0.15}
          triggerConfettiOnClick={true}
          onClick={() => setIsSnapBotOpen(true)}
          className="gold-pulse-btn group relative flex items-center gap-3 px-5 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-semibold text-sm sm:text-base shadow-luxury transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Check Availability & Get Quote"
        >
          <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
          </div>
          <span className="tracking-wide">Check Availability &amp; Get Quote</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
          </span>
        </MagneticButton>
      </div>
    </div>
  );
};
