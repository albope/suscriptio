import { SERVICE_REGISTRY, ServiceInfo } from '@/constants/serviceRegistry';

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[+\-_.]/g, '').replace(/\s+/g, ' ');
}

export function findService(name: string): ServiceInfo | null {
  if (!name) return null;
  const normalized = normalize(name);

  // 1. Exact name match
  const exact = SERVICE_REGISTRY.find(
    (s) => normalize(s.name) === normalized
  );
  if (exact) return exact;

  // 2. Alias match
  const aliasMatch = SERVICE_REGISTRY.find(
    (s) => s.aliases?.some((a) => normalize(a) === normalized)
  );
  if (aliasMatch) return aliasMatch;

  // 3. Name contains match (service name is contained in input or vice versa)
  const containsMatch = SERVICE_REGISTRY.find((s) => {
    const sNorm = normalize(s.name);
    return normalized.includes(sNorm) || sNorm.includes(normalized);
  });
  if (containsMatch) return containsMatch;

  // 4. Alias contains match
  const aliasContains = SERVICE_REGISTRY.find(
    (s) => s.aliases?.some((a) => {
      const aNorm = normalize(a);
      return normalized.includes(aNorm) || aNorm.includes(normalized);
    })
  );
  if (aliasContains) return aliasContains;

  return null;
}

/** Ordered list of logo sources — first = highest quality */
export function getLogoSources(domain: string, size: number = 64): string[] {
  const resolvedSize = Math.min(size, 256);
  return [
    // 1. Clearbit Logo API — real company logos, high quality PNGs (up to 512px)
    `https://logo.clearbit.com/${domain}?size=${resolvedSize}`,
    // 2. Google Favicon API — fallback, lower quality but very reliable
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${resolvedSize}`,
  ];
}

/** Primary logo URL (kept for backwards compat) */
export function getLogoUrl(domain: string, size: number = 64): string {
  return getLogoSources(domain, size)[0];
}
