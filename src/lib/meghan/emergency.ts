import type { EmergencyScan } from './types';

/**
 * Emergency triage triggers.
 *
 * Philosophy: this is a safety net, so it deliberately errs toward caution. A
 * false positive just makes MEGHAN lead with "please get seen urgently," which
 * is a safe failure mode for a pet-triage tool. Real triage still happens in
 * the model's response — this only guarantees the warning is never buried.
 */

/** Multi-word phrases matched as substrings (after normalization). */
const EMERGENCY_PHRASES: string[] = [
  'hit by car',
  'hit by a car',
  'cant breathe',
  'can not breathe',
  'cannot breathe',
  'trouble breathing',
  'difficulty breathing',
  'labored breathing',
  'struggling to breathe',
  'not breathing',
  'stopped breathing',
  'gasping for air',
  'wont stop bleeding',
  'will not stop bleeding',
  'bleeding a lot',
  'lots of blood',
  'pale gums',
  'white gums',
  'blue gums',
  'blue tongue',
  'ate chocolate',
  'ate xylitol',
  'ate grapes',
  'ate raisins',
  'ate rat poison',
  'ate a lily',
  'ate lilies',
  'rat poison',
  'slug bait',
  'cant pee',
  'can not pee',
  'cannot pee',
  'cant urinate',
  'cannot urinate',
  'straining to pee',
  'straining to urinate',
  'unable to urinate',
  'hard belly',
  'hard abdomen',
  'swollen belly',
  'distended belly',
  'bloated stomach',
  'belly is hard',
  'belly is swollen',
  'belly looks swollen',
  'stomach is hard',
  'stomach is swollen',
  'stomach looks swollen',
  'abdomen is hard',
  'abdomen is swollen',
  'dry heaving',
  'wont wake up',
  'will not wake up',
  'not moving',
  'heat stroke',
  'too hot',
];

/** Single tokens matched on word boundaries (after normalization). */
const EMERGENCY_KEYWORDS: string[] = [
  'bleeding',
  'blood',
  'seizure',
  'seizures',
  'seizing',
  'convulsing',
  'convulsion',
  'convulsions',
  'choking',
  'choke',
  'collapse',
  'collapsed',
  'collapsing',
  'unconscious',
  'unresponsive',
  'poison',
  'poisoned',
  'poisoning',
  'poisonous',
  'toxic',
  'xylitol',
  'antifreeze',
  'rodenticide',
  'overdose',
  'bloat',
  'bloated',
  'gdv',
  'heatstroke',
  'drowning',
  'electrocuted',
];

/** Normalize curly quotes and collapse whitespace so matching is predictable. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'") // curly/modifier apostrophes -> straight
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Scan a single message (typically the user's latest) for emergency signals.
 */
export function scanForEmergency(message: string): EmergencyScan {
  const text = normalize(message);
  const matched: string[] = [];

  for (const phrase of EMERGENCY_PHRASES) {
    if (text.includes(phrase)) matched.push(phrase);
  }

  for (const kw of EMERGENCY_KEYWORDS) {
    const re = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
    if (re.test(text)) matched.push(kw);
  }

  return { isEmergency: matched.length > 0, matched };
}

/**
 * Plain-text emergency banner rendered in the UI when a trigger fires. Kept as
 * static content so the warning shows instantly, even before the model streams.
 */
export const EMERGENCY_BANNER = {
  title: 'This may be an emergency',
  body: "Based on what you described, your pet may need to be seen RIGHT NOW. Please contact your nearest emergency vet or an animal ER immediately. If you suspect poisoning, call the ASPCA Animal Poison Control Center at (888) 426-4435 or the Pet Poison Helpline at (855) 764-7661.",
} as const;
