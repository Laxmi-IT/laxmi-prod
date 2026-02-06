import Image from "next/image";

// Sunburst Logo Component - Half circle with rays above center point
// Single source of truth for the LAXMI sunburst icon used across the app
export function SunburstLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -180 + (i * 180) / 8;
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + Math.cos(rad) * 4;
        const y1 = 22 + Math.sin(rad) * 4;
        const x2 = 20 + Math.cos(rad) * 12;
        const y2 = 22 + Math.sin(rad) * 12;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Full brand logo (icon + text) as an image from the SVG file
// Use for OG images, meta tags, or where the full wordmark is needed
export function LogoText({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo_text.svg"
      alt="LAXMI"
      width={250}
      height={40}
      className={className}
      priority
    />
  );
}

// Brand icon as an image from the SVG file
// Use for favicons, app icons, or standalone icon display
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo_icon.svg"
      alt="LAXMI"
      width={40}
      height={40}
      className={className}
      priority
    />
  );
}
