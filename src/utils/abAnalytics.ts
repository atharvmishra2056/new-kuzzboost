export type HeroVariant = 'classic' | 'futuristic';

function tryGtag(event: string, params: Record<string, any>) {
  try {
    const w = window as any;
    if (w && typeof w.gtag === 'function') {
      w.gtag('event', event, params);
      return true;
    }
  } catch {}
  return false;
}

function tryPlausible(event: string, params: Record<string, any>) {
  try {
    const w = window as any;
    if (w && typeof w.plausible === 'function') {
      w.plausible(event, { props: params });
      return true;
    }
  } catch {}
  return false;
}

export function trackHeroExposure(variant: HeroVariant, source: string) {
  const event = 'hero_exposure';
  const props = { variant, source };
  if (tryGtag(event, props)) return;
  if (tryPlausible(event, props)) return;
  // Fallback to console in dev
  console.debug('[AB] hero_exposure', props);
}

export function trackHeroClick(variant: HeroVariant, cta: string) {
  const event = 'hero_cta_click';
  const props = { variant, cta };
  if (tryGtag(event, props)) return;
  if (tryPlausible(event, props)) return;
  console.debug('[AB] hero_cta_click', props);
}
