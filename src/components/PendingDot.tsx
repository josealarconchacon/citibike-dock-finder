"use client";

import { useLinkStatus } from "next/link";

export function PendingDot() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={`ml-2 inline-block size-2 rounded-full bg-current ${
        pending ? "animate-pulse" : "invisible"
      }`}
    />
  );
}
