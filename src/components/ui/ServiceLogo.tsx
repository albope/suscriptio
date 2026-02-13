import { useState } from 'react';
import { Category } from '@/types';
import { findService, getLogoSources } from '@/utils/serviceMatch';

interface ServiceLogoProps {
  name: string;
  size?: number;
  category?: Category;
  brandColor?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  [Category.STREAMING]: '▶',
  [Category.MUSIC]: '♪',
  [Category.GAMING]: '🎮',
  [Category.PRODUCTIVITY]: '⚡',
  [Category.CLOUD_STORAGE]: '☁',
  [Category.HEALTH_FITNESS]: '♥',
  [Category.NEWS_LEARNING]: '📖',
  [Category.UTILITIES]: '🔧',
  [Category.OTHER]: '★',
};

export const ServiceLogo = ({ name, size = 40, category, brandColor }: ServiceLogoProps) => {
  const [sourceIdx, setSourceIdx] = useState(0);
  const service = findService(name);

  const resolvedColor = brandColor || service?.brandColor || '#00d4ff';
  const initial = name.charAt(0).toUpperCase();
  const categoryIcon = category ? CATEGORY_ICONS[category] : undefined;

  // Request 2x for retina displays, capped at 256
  const sources = service ? getLogoSources(service.domain, Math.min(size * 2, 256)) : [];
  const hasValidSource = service && sourceIdx < sources.length;

  if (hasValidSource) {
    return (
      <div
        style={{
          width: size,
          height: size,
          minWidth: size,
          borderRadius: size * 0.25,
          overflow: 'hidden',
          background: `${resolvedColor}15`,
          border: `1px solid ${resolvedColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={sources[sourceIdx]}
          alt={`${name} logo`}
          width={size * 0.75}
          height={size * 0.75}
          style={{
            objectFit: 'contain',
            borderRadius: size * 0.15,
          }}
          onError={() => setSourceIdx((i) => i + 1)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: styled initial letter with brand color
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: size * 0.25,
        background: `${resolvedColor}20`,
        border: `1px solid ${resolvedColor}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontSize: size * 0.42,
          fontWeight: 700,
          color: resolvedColor,
          lineHeight: 1,
        }}
      >
        {categoryIcon && !service ? categoryIcon : initial}
      </span>
    </div>
  );
};
