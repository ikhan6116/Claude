import FeaturePage from '@/components/meghan/FeaturePage';

const RESOURCES = [
  {
    emoji: '💵',
    title: 'What things cost',
    blurb: 'Ballpark price guides for common procedures, dental cleanings, vaccines, and emergencies.',
    tag: 'Cost guides',
  },
  {
    emoji: '🛡️',
    title: 'Pet insurance, compared',
    blurb: 'Side-by-side breakdowns of coverage, waiting periods, and what the fine print really means.',
    tag: 'Insurance',
  },
  {
    emoji: '🧾',
    title: 'New-pet supply checklists',
    blurb: 'Exactly what you need for a puppy, kitten, senior rescue, or a new small animal — no upsells.',
    tag: 'Supplies',
  },
  {
    emoji: '📖',
    title: 'Vetted care articles',
    blurb: 'Plain-language explainers on nutrition, parasite prevention, dental care, and behavior.',
    tag: 'Learn',
  },
  {
    emoji: '💊',
    title: 'OTC & supplement guide',
    blurb: 'Which over-the-counter products are actually safe, and the doses you must confirm with your vet.',
    tag: 'Products',
  },
  {
    emoji: '📅',
    title: 'Wellness timelines',
    blurb: 'Age-by-age checklists so you never miss a vaccine booster or a life-stage checkup.',
    tag: 'Preventive',
  },
];

export default function Resources() {
  return (
    <FeaturePage
      icon="📚"
      title="Resources & Links"
      subtitle="The practical stuff: what things cost, how insurance really works, and what to actually buy — curated so you can skip the guesswork."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((r) => (
          <div
            key={r.title}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                {r.emoji}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                {r.tag}
              </span>
            </div>
            <h3 className="mt-3 font-bold text-emerald-950">{r.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{r.blurb}</p>
          </div>
        ))}
      </div>
    </FeaturePage>
  );
}
