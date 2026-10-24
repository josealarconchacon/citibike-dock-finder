import { availabilityLevel, type AvailabilityLevel } from "@/lib/format";

export type StatusStyles = { bg: string; text: string; border: string; dot: string };

// Full class names, written out so Tailwind can find them when it scans the code.
const STATUS_STYLES: Record<AvailabilityLevel, StatusStyles> = {
  none: {
    bg: "bg-status-none-bg",
    text: "text-status-none-text",
    border: "border-status-none-border",
    dot: "bg-status-none-dot",
  },
  low: {
    bg: "bg-status-low-bg",
    text: "text-status-low-text",
    border: "border-status-low-border",
    dot: "bg-status-low-dot",
  },
  good: {
    bg: "bg-status-good-bg",
    text: "text-status-good-text",
    border: "border-status-good-border",
    dot: "bg-status-good-dot",
  },
};

// The colors for a count: 0 = red, 1-3 = amber, 4+ = green. Always show the number too,
// so the status never depends on color alone.
export function statusStyles(count: number): StatusStyles {
  return STATUS_STYLES[availabilityLevel(count)];
}
