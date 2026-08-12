import type { AppFeature } from './types';

/**
 * Single source of truth for the pet-care app's features.
 *
 * Used both by the UI (sidebar / cross-promotion cards) and to build MEGHAN's
 * system prompt, so the assistant only ever points users at sections that
 * actually exist in the product.
 */
export const APP_FEATURES: AppFeature[] = [
  {
    id: 'community',
    name: 'Community Chatgroups',
    description:
      'Topic-based groups: Product Experiences, New Pet Parents, Breed Clubs, Grief Support, and more.',
    href: '/meghan/community',
    icon: '💬',
    promptFor:
      'the user wants firsthand experiences with a product, is a beginner, is grieving a pet, or is looking for activities and people who understand. Point grieving users specifically to the "Grief Support" group, and product questions to the "Product Experiences" group.',
  },
  {
    id: 'resources',
    name: 'Resources & Links',
    description:
      'Cost guides, pet insurance comparisons, supply checklists, and vetted care articles.',
    href: '/meghan/resources',
    icon: '📚',
    promptFor:
      'the user asks about costs, pet insurance, or general supplies.',
  },
  {
    id: 'rescues',
    name: 'Rescues, Fostering & Donations',
    description:
      'Shelter directory, foster and volunteer sign-ups, and pet-medical crowdfunding pages.',
    href: '/meghan/rescues',
    icon: '🏠',
    promptFor:
      'the user wants a new pet, wants to help animals, or needs financial help with a vet bill (crowdfunding).',
  },
  {
    id: 'petstagram',
    name: 'Pet-stagram',
    description:
      "Share your pet's milestones, recovery progress, and cute videos on the app's social feed.",
    href: '/meghan/petstagram',
    icon: '📸',
    promptFor:
      'the user has a milestone, recovery update, or cute moment worth sharing. You may mention that building a following there could lead to brand sponsorships.',
  },
];

export function getFeature(id: string): AppFeature | undefined {
  return APP_FEATURES.find((f) => f.id === id);
}
