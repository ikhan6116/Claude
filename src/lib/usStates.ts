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

// 3-digit ZIP prefix ranges → state, as [minPrefix, maxPrefix, code].
// Used to recover a state code when a free-typed address didn't include one.
const ZIP_RANGES: Array<[number, number, string]> = [
  [10, 27, 'MA'], [28, 29, 'RI'], [30, 38, 'NH'], [39, 49, 'ME'], [50, 59, 'VT'],
  [60, 69, 'CT'], [70, 89, 'NJ'], [100, 149, 'NY'], [150, 196, 'PA'], [197, 199, 'DE'],
  [200, 205, 'DC'], [206, 219, 'MD'], [220, 246, 'VA'], [247, 268, 'WV'], [270, 289, 'NC'],
  [290, 299, 'SC'], [300, 319, 'GA'], [320, 349, 'FL'], [350, 369, 'AL'], [370, 385, 'TN'],
  [386, 397, 'MS'], [398, 399, 'GA'], [400, 427, 'KY'], [430, 459, 'OH'], [460, 479, 'IN'],
  [480, 499, 'MI'], [500, 528, 'IA'], [530, 549, 'WI'], [550, 567, 'MN'], [570, 577, 'SD'],
  [580, 588, 'ND'], [590, 599, 'MT'], [600, 629, 'IL'], [630, 658, 'MO'], [660, 679, 'KS'],
  [680, 693, 'NE'], [700, 714, 'LA'], [716, 729, 'AR'], [730, 749, 'OK'], [750, 799, 'TX'],
  [800, 816, 'CO'], [820, 831, 'WY'], [832, 838, 'ID'], [840, 847, 'UT'], [850, 865, 'AZ'],
  [870, 884, 'NM'], [889, 898, 'NV'], [900, 961, 'CA'], [967, 968, 'HI'], [970, 979, 'OR'],
  [980, 994, 'WA'], [995, 999, 'AK'],
];

/**
 * Derive a 2-letter state code from a US ZIP code (first 3 digits).
 * Returns '' when the ZIP is missing or outside the known ranges.
 */
export function zipToStateCode(zip?: string): string {
  if (!zip) return '';
  const digits = zip.replace(/\D/g, '');
  if (digits.length < 5) return '';
  const prefix = parseInt(digits.slice(0, 3), 10);
  if (isNaN(prefix)) return '';
  for (const [min, max, code] of ZIP_RANGES) {
    if (prefix >= min && prefix <= max) return code;
  }
  return '';
}
