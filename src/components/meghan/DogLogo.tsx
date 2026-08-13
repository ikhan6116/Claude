/**
 * German Shepherd head mark used as the MyKobe / MEGHAN logo.
 *
 * Pure inline SVG (uses currentColor) so it stays crisp at any size, works in
 * light/dark, and needs no external asset. Give it a size + text color via
 * className, e.g. <DogLogo className="h-6 w-6 text-white" />.
 */
export default function DogLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="currentColor"
      role="img"
      aria-label="German Shepherd logo"
    >
      {/* Head silhouette: two upright pointed ears, tapering to a muzzle */}
      <path
        d="M13 3 L24 21 L40 21 L51 3 C55 13 55 25 51 33 C47 44 41 52 32 61 C23 52 17 44 13 33 C9 25 9 13 13 3 Z"
        opacity="0.95"
      />
      {/* Muzzle / lower face highlight */}
      <path
        d="M24 34 L40 34 C39 44 36 51 32 57 C28 51 25 44 24 34 Z"
        fill="#ffffff"
        opacity="0.22"
      />
      {/* Eyes */}
      <circle cx="24.5" cy="30" r="2.4" fill="#ffffff" />
      <circle cx="39.5" cy="30" r="2.4" fill="#ffffff" />
      {/* Nose */}
      <circle cx="32" cy="45" r="3.1" fill="#ffffff" />
    </svg>
  );
}
