import React, { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { publishStudioScroll } from './scroll/studioScroll';
import { CustomCursor } from './components/CustomCursor';
import { StickyHeader } from './components/StickyHeader';
import { HeroSection } from './components/HeroSection';
import { OriginManifestoSection } from './components/OriginManifestoSection';
import { StageProofSection } from './components/StageProofSection';
import { DualArchitectureSection } from './components/DualArchitectureSection';
import { LookbookSection } from './components/LookbookSection';
import { CreatorContactFooter } from './components/CreatorContactFooter';

export const App: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('hero-00');

  useEffect(() => {
    const publishNative = () => {
      publishStudioScroll(window.scrollY || document.documentElement.scrollTop || 0);
    };
    publishNative();
    window.addEventListener('scroll', publishNative, { passive: true });

    const isJsdom =
      typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '');
    if (isJsdom) {
      return () => window.removeEventListener('scroll', publishNative);
    }

    let rafId = 0;
    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
      });
      lenisRef.current = lenis;

      const onLenisScroll = (instance: Lenis) => {
        publishStudioScroll(instance.scroll);
      };
      lenis.on('scroll', onLenisScroll);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };
      rafId = window.requestAnimationFrame(raf);

      return () => {
        window.removeEventListener('scroll', publishNative);
        window.cancelAnimationFrame(rafId);
        lenis?.off('scroll', onLenisScroll);
        lenis?.destroy();
        lenisRef.current = null;
      };
    } catch {
      return () => window.removeEventListener('scroll', publishNative);
    }
  }, []);

  const handleNavigate = useCallback((targetSectionId: string) => {
    setActiveSectionId(targetSectionId);
    const targetEl = document.getElementById(targetSectionId);
    if (!targetEl) return;

    if (lenisRef.current) {
      const lenis = lenisRef.current;
      // Playwright's click scrolls the sticky control into view and can leave
      // Lenis's animated scroll ahead of window.scrollY. Snap to the real
      // position first so the next scrollTo measures the section correctly.
      lenis.scrollTo(window.scrollY || 0, { immediate: true, force: true });
      lenis.scrollTo(targetEl, { offset: -48 });
    } else if (typeof targetEl.scrollIntoView === 'function') {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      data-testid="ganja-app-shell"
      className="min-h-screen w-full bg-[#F4F3EF] text-[#111111] relative"
      style={{ borderRadius: '0px' }}
    >
      <CustomCursor />
      <StickyHeader onNavigate={handleNavigate} activeSectionId={activeSectionId} />

      <main role="main" className="w-full">
        <HeroSection />
        <OriginManifestoSection />
        <StageProofSection />
        <DualArchitectureSection />
        <LookbookSection />
        <CreatorContactFooter />
      </main>
    </div>
  );
};

export default App;
