import FeaturePage from '@/components/meghan/FeaturePage';

const WAYS_TO_HELP = [
  {
    emoji: '🔎',
    title: 'Shelter directory',
    blurb: 'Search adoptable pets and reputable rescues near you, filtered by species, size, and needs.',
    cta: 'Browse shelters',
  },
  {
    emoji: '🤝',
    title: 'Foster & volunteer',
    blurb: 'Not ready to adopt forever? Fostering saves lives. Sign up and get matched with a local rescue.',
    cta: 'Sign up to help',
  },
  {
    emoji: '💝',
    title: 'Vet-bill crowdfunding',
    blurb: 'Facing a scary bill? Start a community fundraiser, or chip in a few dollars for a pet in crisis.',
    cta: 'Start a fundraiser',
  },
];

const CAMPAIGNS = [
  { name: 'Help Biscuit beat parvo', raised: 1840, goal: 3000 },
  { name: "Luna's emergency surgery", raised: 4120, goal: 5000 },
  { name: 'Senior cat dental fund', raised: 620, goal: 1200 },
];

export default function Rescues() {
  return (
    <FeaturePage
      icon="🏠"
      title="Rescues, Fostering & Donations"
      subtitle="Thinking about a new pet, or want to help animals in need? Whether you adopt, foster, or donate, there's a way to make a difference here."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {WAYS_TO_HELP.map((w) => (
          <div
            key={w.title}
            className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
              {w.emoji}
            </span>
            <h3 className="mt-3 font-bold text-emerald-950">{w.title}</h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-600">{w.blurb}</p>
            <button
              type="button"
              className="mt-4 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              {w.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-emerald-950">Active fundraisers</h2>
        <p className="mt-1 text-sm text-gray-500">
          Every little bit helps a pet get the care they need.
        </p>
        <div className="mt-5 space-y-4">
          {CAMPAIGNS.map((c) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <div
                key={c.name}
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-emerald-950">{c.name}</h3>
                  <span className="text-sm font-semibold text-emerald-600">{pct}%</span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  ${c.raised.toLocaleString()} raised of ${c.goal.toLocaleString()} goal
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </FeaturePage>
  );
}
