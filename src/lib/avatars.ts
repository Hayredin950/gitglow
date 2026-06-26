/**
 * Avatar system for GitGlow profiles
 * Provides 3 distinct avatar styles that can be used with initials or placeholder
 */

export type AvatarStyle = "professional" | "creative" | "classic";

export interface AvatarConfig {
  style: AvatarStyle;
  initials: string;
  backgroundColor: string;
  textColor: string;
}

export const AVATAR_STYLES: Record<AvatarStyle, AvatarConfig> = {
  professional: {
    style: "professional",
    initials: "",
    backgroundColor: "#1e40af",
    textColor: "#ffffff",
  },
  creative: {
    style: "creative",
    initials: "",
    backgroundColor: "#7c3aed",
    textColor: "#ffffff",
  },
  classic: {
    style: "classic",
    initials: "",
    backgroundColor: "#059669",
    textColor: "#ffffff",
  },
};

/**
 * Generate SVG avatar based on style and initials
 */
export function generateAvatarSVG(
  style: AvatarStyle,
  initials: string
): string {
  const config = AVATAR_STYLES[style];
  const size = 200;
  const fontSize = 80;

  let pattern = "";

  if (style === "professional") {
    // Professional: Clean, corporate look with geometric pattern
    pattern = `
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="${config.textColor}" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="${size}" height="${size}" fill="${config.backgroundColor}"/>
      <rect width="${size}" height="${size}" fill="url(#dots)"/>
      <circle cx="50" cy="50" r="30" fill="${config.textColor}" opacity="0.1"/>
      <circle cx="150" cy="150" r="40" fill="${config.textColor}" opacity="0.05"/>
    `;
  } else if (style === "creative") {
    // Creative: Vibrant with gradient and dynamic shapes
    pattern = `
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      <path d="M 0 0 Q 100 50 200 0 L 200 50 Q 100 100 0 50 Z" fill="${config.textColor}" opacity="0.1"/>
      <circle cx="100" cy="100" r="50" fill="${config.textColor}" opacity="0.05"/>
    `;
  } else {
    // Classic: Timeless design with simple geometric shapes
    pattern = `
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      <rect x="0" y="0" width="${size}" height="40" fill="${config.textColor}" opacity="0.05"/>
      <rect x="0" y="160" width="${size}" height="40" fill="${config.textColor}" opacity="0.05"/>
      <circle cx="100" cy="100" r="35" fill="${config.textColor}" opacity="0.08"/>
    `;
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${pattern}
      <text x="100" y="130" font-size="${fontSize}" font-weight="bold" text-anchor="middle" fill="${config.textColor}">
        ${initials}
      </text>
    </svg>
  `;
}

/**
 * Convert SVG to Data URL for use in images
 */
export function avatarSVGToDataURL(svg: string): string {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Get avatar URL for a user
 */
export function getAvatarURL(
  style: AvatarStyle,
  initials: string
): string {
  const svg = generateAvatarSVG(style, initials);
  return avatarSVGToDataURL(svg);
}

/**
 * Get avatar display information
 */
export function getAvatarInfo(style: AvatarStyle) {
  const descriptions: Record<AvatarStyle, string> = {
    professional:
      "Clean, corporate aesthetic with geometric patterns - perfect for formal portfolios",
    creative:
      "Vibrant gradient design with dynamic shapes - ideal for creative professionals",
    classic:
      "Timeless geometric design - works great for any professional context",
  };

  return {
    style,
    description: descriptions[style],
    colors: AVATAR_STYLES[style],
  };
}
