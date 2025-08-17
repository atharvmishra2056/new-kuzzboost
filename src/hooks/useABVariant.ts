import { useState } from 'react';

export type HeroVariant = 'classic' | 'futuristic';

interface UseABVariantOptions {
  flagEnabled: boolean;
  defaultVariant: HeroVariant;
  experimentKey?: string;
}

interface ABState {
  variant: HeroVariant;
  source: 'flag' | 'query' | 'storage' | 'random' | 'ssr';
}

export function useABVariant({ flagEnabled, defaultVariant, experimentKey = 'ab:hero:v1' }: UseABVariantOptions): ABState {
  const [state] = useState<ABState>(() => {
    if (typeof window === 'undefined') {
      return { variant: defaultVariant, source: 'ssr' };
    }

    if (!flagEnabled) {
      return { variant: defaultVariant, source: 'flag' };
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const param = params.get('hero');
      if (param === 'classic' || param === 'futuristic') {
        window.localStorage.setItem(experimentKey, param);
        return { variant: param, source: 'query' };
      }

      const stored = window.localStorage.getItem(experimentKey);
      if (stored === 'classic' || stored === 'futuristic') {
        return { variant: stored, source: 'storage' };
      }

      const rand: HeroVariant = Math.random() < 0.5 ? 'classic' : 'futuristic';
      window.localStorage.setItem(experimentKey, rand);
      return { variant: rand, source: 'random' };
    } catch {
      return { variant: defaultVariant, source: 'flag' };
    }
  });

  return state;
}
