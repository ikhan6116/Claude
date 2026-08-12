// Shared types for the MEGHAN veterinary AI agent.

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** A section/feature of the pet-care app that MEGHAN can guide users toward. */
export interface AppFeature {
  /** Stable id, also used as an anchor/route slug. */
  id: string;
  /** Short display name. */
  name: string;
  /** One-line description shown in the UI. */
  description: string;
  /** In-app route the feature lives at. */
  href: string;
  /** Emoji used as a lightweight icon. */
  icon: string;
  /** When MEGHAN should naturally point a user here (used to build the system prompt). */
  promptFor: string;
}

/** Result of scanning a user message for emergency signals. */
export interface EmergencyScan {
  isEmergency: boolean;
  /** The specific triggers that matched (for transparency / logging). */
  matched: string[];
}
