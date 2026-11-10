export const STRICT_GUARDRAIL_RESPONSE =
  'Our lead photographer will review your request and call back with a custom quote.';

export interface GuardrailMatch {
  triggered: boolean;
  category?: 'discount' | 'multiday' | 'travel' | 'equipment';
  reason?: string;
  badgeLabel?: string;
}

/**
 * Returns an intelligent, context-aware luxury response specific to the guardrail category.
 * Every response contains the mandated studio review clause while answering the user's exact query with domain authority.
 */
export function getDetailedGuardrailResponse(match: GuardrailMatch, clientName?: string): string {
  const nameSalutation = clientName ? `${clientName}, ` : '';

  switch (match.category) {
    case 'travel':
      return `${nameSalutation}Yes, absolutely! ✈️ While our flagship studio is in Jubilee Hills, Hyderabad, PixelStory Studios frequently documents destination celebrations across India (Goa beach ceremonies, Udaipur palaces, Bangalore, Vizag, and Rajasthan).

For destination shoots, crew travel and accommodation logistics are budgeted transparently at actuals. Our lead photographer will review your destination logistics and call back with a custom quote.`;

    case 'equipment':
      return `${nameSalutation}Splendid cinematographic choice! 🎥 While our standard flagship fleet operates full-frame Sony FX6 & FX3 Cinema Line cameras with G-Master prime glass (50mm f/1.2 & 85mm f/1.4 GM), we frequently deploy RED Komodo 6K, RED V-Raptor, and Cooke Anamorphic cine glass for high-end cinematic productions.

Custom cinema packages require specialized focus pullers and DIT data management. Our lead photographer will review your camera modifications and call back with a custom quote.`;

    case 'multiday':
      return `${nameSalutation}We specialize in grand multi-day celebrations! 🌟 For 2 to 4-day weddings spanning Haldi, Pellikuthuru, Sangeet, Vedic Muhurtham, and Reception, we offer dedicated multi-day bespoke coverage with dedicated senior crews and same-day LED wall teaser edits.

Our lead photographer will review your multi-day itinerary and call back with a custom quote.`;

    case 'discount':
    default:
      return `${nameSalutation}At PixelStory Studios, our pricing is standardized and transparent with zero hidden fees to guarantee prime Sony Cinema Line equipment and senior directors for every celebration.

However, for full upfront advance or multi-event bookings, our studio director can curate custom value add-ons (such as complimentary 4K drone aerials or an extra royal leather album). Our lead photographer will review your request and call back with a custom quote.`;
  }
}


const DISCOUNT_PATTERNS = [
  /discount/i,
  /cheaper/i,
  /negotiat/i,
  /less\s+(price|cost|charge|quote)/i,
  /reduce\s+(price|cost|rate)/i,
  /bargain/i,
  /offer/i,
  /concession/i,
  /best\s+(price|rate|deal)/i,
  /lowest\s+(price|cost)/i,
  /\bdeal\b/i,
  /\bcoupon\b/i,
  /\bpromo\b/i,
  /\d+%\s*off/i,
  /cut\s+(down|off)/i,
  /any\s+(flexibility|waiver)/i,
];

const MULTIDAY_PATTERNS = [
  /multi[\s-]?day/i,
  /multiple\s+days/i,
  /2[\s-]?days?/i,
  /3[\s-]?days?/i,
  /4[\s-]?days?/i,
  /two\s+days?/i,
  /three\s+days?/i,
  /four\s+days?/i,
  /five\s+days?/i,
  /sangeet\s+(and|&)\s+reception/i,
  /haldi\s+(and|&)\s+wedding/i,
  /mehendi\s+(and|&)\s+wedding/i,
  /spread\s+over\s+days/i,
  /separate\s+days/i,
];

const TRAVEL_PATTERNS = [
  /outside\s+hyderabad/i,
  /outstation/i,
  /travel/i,
  /destination/i,
  /outside\s+city/i,
  /goa/i,
  /vijayawada/i,
  /vizag/i,
  /visakhapatnam/i,
  /bangalore/i,
  /bengaluru/i,
  /delhi/i,
  /mumbai/i,
  /jaipur/i,
  /udaipur/i,
  /warangal/i,
  /khammam/i,
  /tirupati/i,
  /distance/i,
  /flight/i,
  /interstate/i,
];

const CAMERA_MOD_PATTERNS = [
  /camera\s+mod/i,
  /camera\s+change/i,
  /modification/i,
  /red\s+(camera|komodo|v-raptor)/i,
  /arri\s+(alexa|mini|amira)?/i,
  /sony\s+fx[369]/i,
  /fx3/i,
  /fx6/i,
  /a7s\s*iii/i,
  /a7iv/i,
  /blackmagic/i,
  /anamorphic/i,
  /steadicam/i,
  /jimmy\s*jib/i,
  /special\s+(gear|lens|lens package|equipment)/i,
  /prime\s+lenses/i,
  /modify\s+gear/i,
  /custom\s+equipment/i,
  /360\s+camera/i,
];

export function checkGuardrails(message: string): GuardrailMatch {
  const trimmed = message.trim();

  for (const pattern of DISCOUNT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        triggered: true,
        category: 'discount',
        reason: 'Custom discount or pricing negotiation request',
      };
    }
  }

  for (const pattern of MULTIDAY_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        triggered: true,
        category: 'multiday',
        reason: 'Multi-day event schedule inquiry',
      };
    }
  }

  for (const pattern of TRAVEL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        triggered: true,
        category: 'travel',
        reason: 'Travel outside Hyderabad / Destination shoot inquiry',
      };
    }
  }

  for (const pattern of CAMERA_MOD_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        triggered: true,
        category: 'equipment',
        reason: 'Camera equipment modifications or custom setup inquiry',
      };
    }
  }

  return { triggered: false };
}

// Preset test scenarios for demo & judges
export const GUARDRAIL_DEMO_PROMPTS = [
  {
    label: '💰 Ask for 25% Discount',
    prompt: 'Can you give a 25% discount if we pay advance today?',
    category: 'Discount Negotiation',
  },
  {
    label: '🗓️ 3-Day Wedding Schedule',
    prompt: 'Our wedding ceremonies run across 3 days (Haldi, Sangeet, and Reception). What is the total package?',
    category: 'Multi-Day Schedule',
  },
  {
    label: '✈️ Destination Shoot in Goa',
    prompt: 'Can your team travel outside Hyderabad for our beach wedding in Goa?',
    category: 'Travel / Outstation',
  },
  {
    label: '🎥 RED / Arri Camera Upgrade',
    prompt: 'We want camera modifications with RED Komodo cinema cameras instead of standard ones.',
    category: 'Camera Modifications',
  },
];

