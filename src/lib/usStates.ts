// Maps US state names and abbreviations to their 2-letter USPS code.
const STATE_CODES: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', 'district of columbia': 'DC',
  florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID', illinois: 'IL',
  indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY', louisiana: 'LA',
  maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN',
  mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK',
  oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
};

const VALID_ABBRS = new Set(Object.values(STATE_CODES));

/**
 * Normalize a state input to its 2-letter USPS code.
 * Accepts an abbreviation ("tx", "TX") or a full name ("Texas", "new york").
 * Returns '' when the input can't be resolved to a real US state.
 */
export function toStateCode(input?: string): string {
  if (!input) return '';
  const s = input.trim();
  const upper = s.toUpperCase();
  if (s.length === 2 && VALID_ABBRS.has(upper)) return upper;
  return STATE_CODES[s.toLowerCase()] || '';
}
