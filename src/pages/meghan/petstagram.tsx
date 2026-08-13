import FeaturePage from '@/components/meghan/FeaturePage';
import PetVerification from '@/components/meghan/PetVerification';

const POSTS = [
  { pet: 'Waffles', handle: '@waffles_thecorgi', emoji: '🐶', caption: 'Day 14 post-op and back to the zoomies! Thank you all for the support 💚', likes: 1284 },
  { pet: 'Mochi', handle: '@mochi.meows', emoji: '🐱', caption: 'First birthday! Refused the hat but accepted the treats.', likes: 2043 },
  { pet: 'Pickles', handle: '@pickles.the.pig', emoji: '🐷', caption: 'New harness, who dis. Ready for our morning walk.', likes: 876 },
  { pet: 'Sunny', handle: '@sunny.thegolden', emoji: '🦮', caption: 'Passed his therapy-dog certification today! So proud of this boy.', likes: 3310 },
  { pet: 'Kiwi', handle: '@kiwi.tweets', emoji: '🦜', caption: 'Learned a new word this week. It was not a polite one.', likes: 1522 },
  { pet: 'Bean', handle: '@bean.the.bun', emoji: '🐰', caption: 'Binky compilation coming soon. Stay tuned.', likes: 999 },
];

export default function Petstagram() {
  return (
    <FeaturePage
      icon="📸"
      title="Pet-stagram"
      subtitle="Share your pet's milestones, recovery wins, and cutest moments. Build a following — some pet creators here even land brand sponsorships."
    >
      <PetVerification />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <div
            key={p.handle}
            className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
          >
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-lg">
                {p.emoji}
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-950">{p.pet}</p>
                <p className="text-xs text-gray-400">{p.handle}</p>
              </div>
            </div>
            <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-6xl">
              {p.emoji}
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-700">{p.caption}</p>
              <p className="mt-2 text-xs font-medium text-gray-400">
                ❤️ {p.likes.toLocaleString()} likes
              </p>
            </div>
          </div>
        ))}
      </div>
    </FeaturePage>
  );
}
