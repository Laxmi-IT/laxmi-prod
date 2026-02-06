import { LogoIconSvg } from "./logo-icon-paths";
import { LogoTextSvg } from "./logo-text-paths";

// Sunburst Logo Icon - actual brand SVG with currentColor support
// Single source of truth for the LAXMI sunburst icon used across the app
export function SunburstLogo({ className = "" }: { className?: string }) {
  return <LogoIconSvg className={className} />;
}

// Full brand logo (icon + LAXMI text) as inline SVG with currentColor support
export function LogoText({ className = "" }: { className?: string }) {
  return <LogoTextSvg className={className} />;
}

// Re-export the raw SVG components for direct use
export { LogoIconSvg, LogoTextSvg };
