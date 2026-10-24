import type { ReactNode } from "react";

// Decorative line icons. They are hidden from screen readers, so whatever uses one must
// also have visible text or an aria-label.
function Icon({ className = "size-4", children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function BikeIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </Icon>
  );
}

export function PinIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  );
}

export function DirectionsIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 11 22 2l-9 19-2-8-8-2z" />
    </Icon>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}
