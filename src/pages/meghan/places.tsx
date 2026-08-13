import { useMemo, useState } from 'react';
import FeaturePage from '@/components/meghan/FeaturePage';

type Category = 'All' | 'Parks' | 'Restaurants' | 'Hotels' | 'Stores';

interface Place {
  name: string;
  category: Exclude<Category, 'All'>;
  emoji: string;
  blurb: string;
  rating: number;
  distanceMi: number;
}

// Sample data. In production this comes from a live places API (Google Places,
// Yelp, or a BringFido-style feed) filtered by the user's geolocation.
const PLACES: Place[] = [
  { name: 'Riverside Dog Park', category: 'Parks', emoji: '🌳', blurb: 'Fenced off-leash area with a small-dog section and water fountains.', rating: 4.8, distanceMi: 0.6 },
  { name: 'The Barking Lot Café', category: 'Restaurants', emoji: '☕', blurb: 'Patio dining with a dog menu and free pup-cups.', rating: 4.6, distanceMi: 1.1 },
  { name: 'Wag Inn & Suites', category: 'Hotels', emoji: '🏨', blurb: 'Pet-friendly rooms, no weight limit, welcome treats at check-in.', rating: 4.5, distanceMi: 2.3 },
  { name: 'Tails & Trails Outfitters', category: 'Stores', emoji: '🛍️', blurb: 'Leashes-welcome gear shop with an in-store water bowl station.', rating: 4.7, distanceMi: 0.9 },
  { name: 'Meadowbrook Off-Leash Field', category: 'Parks', emoji: '🐕', blurb: 'Big open field, agility equipment, shaded benches.', rating: 4.4, distanceMi: 3.0 },
  { name: 'Hound & Harvest Kitchen', category: 'Restaurants', emoji: '🍽️', blurb: 'Dog-friendly patio, house-made dog biscuits by the door.', rating: 4.3, distanceMi: 1.8 },
  { name: 'The Fetch Hotel Downtown', category: 'Hotels', emoji: '🛎️', blurb: 'Dog-walking service, in-room beds and bowls on request.', rating: 4.6, distanceMi: 4.2 },
  { name: 'Whiskers & Wags Market', category: 'Stores', emoji: '🦴', blurb: 'Natural pet foods, self-serve dog wash, breed-savvy staff.', rating: 4.9, distanceMi: 1.4 },
];

const CATEGORIES: Category[] = ['All', 'Parks', 'Restaurants', 'Hotels', 'Stores'];

export default function Places() {
  const [active, setActive] = useState<Category>('All');

  const filtered = useMemo(
    () => PLACES.filter((p) => active === 'All' || p.category === active).sort((a, b) => a.distanceMi - b.distanceMi),
    [active]
  );

  return (
    <FeaturePage
      icon="📍"
      title="Pet-Friendly Places"
      subtitle="Find dog-friendly stores, restaurants, hotels, and parks near you — so your best friend never has to stay home."
    >
      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100 shadow-sm">
        <div className="relative h-64 w-full bg-emerald-100/60 sm:h-80">
          <iframe
            title="Pet-friendly places map"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-73.9950%2C40.7480%2C-73.9600%2C40.7720&layer=mapnik"
          />
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
            📍 Sample area — connect a live places API + your location for real results
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={
              active === c
                ? 'rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white'
                : 'rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50'
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.name}
            className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                {p.emoji}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                {p.category}
              </span>
            </div>
            <h3 className="mt-3 font-bold text-emerald-950">{p.name}</h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-600">{p.blurb}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>⭐ {p.rating.toFixed(1)}</span>
              <span>{p.distanceMi.toFixed(1)} mi away</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-center text-sm text-gray-600">
        Showing sample listings. Hooking this up to a live places API (Google Places / Yelp /
        BringFido-style feed) plus device location will surface real pet-friendly spots near you.
      </p>
    </FeaturePage>
  );
}
