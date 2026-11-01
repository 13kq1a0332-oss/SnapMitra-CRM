import React, { useState } from 'react';
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
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

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
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    description: 'A grand Telugu royal celebration overlooking the City of Pearls, captured with cinematic color grading.',
  },
  {
    id: 'ananthagiri',
    title: 'Sunset Mist Romance',
    location: 'Ananthagiri Hills, Vikarabad',
    gear: 'Canon Cinema EOS • Anamorphic Primes • 4K Drone Fleet',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden-hour couple portraiture framed against pine trees and mist-draped hilltops.',
  },
  {
    id: 'jubilee',
    title: 'The Heritage Muhurtham',
    location: 'Jubilee Hills Heritage Gardens',
    gear: 'Dual Sony A7S III • Steadicam Master Rig • Live LED stream',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional Telugu rituals, sacred fire embers, and candid familial emotions documented raw.',
  },
];

const TESTIMONIALS = [
  {
    quote: "PixelStory Studios immortalized our Taj Falaknuma wedding! The candid cinema film made everyone tear up. The SnapBot quote was exact, zero hidden fees.",
    couple: "Siddharth & Ananya Reddy",
    venue: "Taj Falaknuma Palace, Hyderabad",
    rating: 5,
  },
  {
    quote: "From our sunrise pre-wedding at Ananthagiri to the grand reception at Novotel HICC, Vikram's team worked with incredible warmth and perfection.",
    couple: "Vikram & Sneha Varma",
    venue: "Novotel HICC Hyderabad",
    rating: 5,
  },
  {
    quote: "The live drone stream and same-day teaser reel were mind-blowing. Our guests were stunned by the film quality. Truly Hyderabad's finest studio.",
    couple: "Rajesh & Priya Kulkarni",
    venue: "Jubilee Hills, Hyderabad",
    rating: 5,
  },
];

export const CustomerView: React.FC = () => {
  const { openSnapBotWithPackage, setIsSnapBotOpen, setIsPackageCustomizerOpen } = useLeads();
  const [activeLightbox, setActiveLightbox] = useState<PortfolioGalleryItem | null>(null);

  const offerings = [
    {
      id: 'traditional-wedding',
      name: 'Traditional Wedding',
      packageTier: 'Gold Package',
      price: '₹75,000',
      badgeColor: 'border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/10',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
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
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
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
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
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

  return (
    <div className="min-h-screen bg-[#0B0B0C] pb-28 text-white relative">
      {/* Background ambient luxury glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A22] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium mb-6 shadow-gold-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hyderabad’s Premier Luxury Wedding Photography</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight sm:leading-tight">
          Where Grand Hyderabad Celebrations Become{' '}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11]">
            Immortal Works of Art
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed">
          From Falaknuma palace ceremonies to serene destination pre-weddings, PixelStory Studios crafts 
          masterful frames with zero compromises. Select our signature packages below or chat with 
          <strong className="text-[#D4AF37] font-medium"> SnapBot</strong> for an instant verified quote.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsSnapBotOpen(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-semibold text-xs sm:text-sm shadow-gold-sm hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Chat with SnapBot AI</span>
          </button>

          <button
            onClick={() => setIsPackageCustomizerOpen(true)}
            className="px-6 py-3 rounded-full bg-[#181822] hover:bg-[#232330] text-gray-200 border border-[#2E2E3E] hover:border-[#D4AF37]/50 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-[#D4AF37]" />
            <span>Interactive Quote Calculator</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>850+ Luxury Celebrations</span>
          </div>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#D4AF37]" />
            <span>4K Cinema Drone Fleet</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Zero-Delay Guaranteed Delivery</span>
          </div>
        </div>
      </section>

      {/* Portfolio & Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Signature Portfolio Offerings
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Transparent luxury pricing with guaranteed master crew reservation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerings.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl overflow-hidden glass-card transition-all duration-300 flex flex-col relative group ${
                pkg.highlight
                  ? 'border-[#D4AF37] shadow-luxury ring-1 ring-[#D4AF37]/50 -translate-y-1'
                  : 'border-[#27272E] hover:border-[#D4AF37]/40 hover:-translate-y-1'
              }`}
            >
              {/* Featured Badge */}
              {pkg.highlight && (
                <div className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black text-[11px] font-bold uppercase tracking-wider py-1 px-4 text-center">
                  ⭐ Studio Masterpiece • Most Requested
                </div>
              )}

              {/* Image Preview */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/30 to-transparent" />
                
                {/* Package Tier Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md border ${pkg.badgeColor}`}>
                    {pkg.packageTier}
                  </span>
                </div>

                {/* Price Display */}
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

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {pkg.tagline}
                  </p>

                  <div className="my-5 border-t border-[#27272E]" />

                  {/* Feature List */}
                  <ul className="space-y-2.5 text-xs text-gray-300">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-4 border-t border-[#27272E]/60 space-y-2">
                  <button
                    onClick={() => openSnapBotWithPackage(pkg.name)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                      pkg.highlight
                        ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5C048] to-[#AA7C11] text-black hover:brightness-110 shadow-gold-sm'
                        : 'bg-[#1F1F26] text-white hover:bg-[#2A2A35] border border-[#2F2F3D] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <span>{pkg.buttonText}</span>
                    <ArrowRight className="w-4 h-4 text-inherit" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Hyderabad Weddings Showcase (Enhancement) */}
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
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
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-[#27272E] relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  ))}
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
            </div>
          ))}
        </div>
      </section>

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

      {/* Floating Action Button (FAB) at bottom-right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSnapBotOpen(true)}
          className="gold-pulse-btn group relative flex items-center gap-3 px-5 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-semibold text-sm sm:text-base shadow-luxury transition-all duration-300 hover:scale-105 active:scale-95"
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
        </button>
      </div>
    </div>
  );
};
