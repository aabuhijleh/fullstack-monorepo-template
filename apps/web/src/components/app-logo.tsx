import { cn } from "@workspace/ui/lib/utils";
import { useId } from "react";

type AppLogoProps = React.ComponentProps<"svg"> & {
  /** Width/height in pixels. Defaults to 32. */
  size?: number;
};

/**
 * Tasklit app mark — a rounded dark tile built from the lucide `list-todo`
 * glyph in crisp white. Mirrors the favicon, app icon, and OG image so the
 * brand stays consistent across surfaces.
 */
export function AppLogo({ size = 32, className, ...props }: AppLogoProps) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Tasklit"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2c2e" />
          <stop offset="1" stopColor="#0c0c0d" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="23" fill={`url(#${gradientId})`} />
      <g
        transform="translate(22 22) scale(2.33333)"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.057}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 5h7" />
        <path d="M13 12h7" />
        <path d="M13 19h7" />
        <rect x="3" y="4" width="6" height="6" rx="1.6" />
        <path d="m3 17 2 2 4-4" />
      </g>
    </svg>
  );
}
