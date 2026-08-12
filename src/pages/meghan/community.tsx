import FeaturePage from '@/components/meghan/FeaturePage';

const GROUPS = [
  {
    name: 'Product Experiences',
    emoji: '⭐',
    blurb: 'Real, firsthand reviews of supplements, foods, gadgets, and that thing you saw on TikTok.',
    members: '12.4k',
  },
  {
    name: 'New Pet Parents',
    emoji: '🐶',
    blurb: 'Just brought someone home? Ask the "is this normal?" questions here — no judgment.',
    members: '9.1k',
  },
  {
    name: 'Grief & Loss Support',
    emoji: '🕊️',
    blurb: 'A gentle space to remember the ones we\'ve lost, held by people who truly understand.',
    members: '6.8k',
  },
  {
    name: 'Breed Clubs',
    emoji: '🎾',
    blurb: 'From Frenchies to tabbies — breed-specific tips, quirks, and health watch-outs.',
    members: '15.2k',
  },
  {
    name: 'Activities & Adventures',
    emoji: '🥾',
    blurb: 'Trails, travel, enrichment games, and meetups to keep your buddy busy and happy.',
    members: '7.3k',
  },
  {
    name: 'Senior Pets',
    emoji: '🧓',
    blurb: 'Comfort, mobility, and quality-of-life support for our distinguished older companions.',
    members: '5.5k',
  },
];

export default function Community() {
  return (
    <FeaturePage
      icon="💬"
      title="Community Chatgroups"
      subtitle="Connect with pet owners who get it. Find your people, swap real experiences, and never feel like you're doing this alone."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <div
            key={g.name}
            className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                {g.emoji}
              </span>
              <div>
                <h3 className="font-bold text-emerald-950">{g.name}</h3>
                <p className="text-xs text-gray-400">{g.members} members</p>
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{g.blurb}</p>
            <button
              type="button"
              className="mt-4 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              Join group
            </button>
          </div>
        ))}
      </div>
    </FeaturePage>
  );
}
