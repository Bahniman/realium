import { useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function SuiteMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let frame = 0;
    let lastFrame = 0;
    let clock = 0;
    let idleFrames = 0;
    let uiFrame = 0;
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const tick = (time: number) => {
      if (!lenis) { frame = 0; return; }
      if (lastFrame) clock += Math.min(64, Math.max(0, time - lastFrame));
      lastFrame = time;
      lenis.raf(clock);
      idleFrames = lenis.isScrolling ? 0 : idleFrames + 1;
      if (idleFrames < 3) frame = requestAnimationFrame(tick);
      else { frame = 0; lastFrame = 0; }
    };
    const wake = () => {
      if (!frame && lenis && !document.hidden) {
        idleFrames = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const setupScroll = () => {
      cancelAnimationFrame(frame); frame = 0; lastFrame = 0;
      lenis?.destroy(); lenis = null;
      if (!reduced.matches) {
        lenis = new Lenis({
          lerp: 0.08, smoothWheel: true, syncTouch: false, autoRaf: false,
          anchors: false, respectReducedMotion: true,
          allowNestedScroll: true,
          prevent: node => node.matches("input, textarea, select, .suite-menu-panel, [data-native-scroll]"),
        });
        lenis.on("virtual-scroll", wake);
      }
    };
    setupScroll();

    const navigate = (hash: string, push: boolean, immediate = false) => {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id || "main");
      if (!target) return;
      const url = location.pathname + location.search + (id === "main" ? "" : hash);
      if (push && location.pathname + location.search + location.hash !== url) history.pushState(null, "", url);
      const header = document.querySelector<HTMLElement>(".suite-header");
      const top = id === "main" || !id ? 0 : Math.max(0,
        target.getBoundingClientRect().top + window.scrollY + (parseFloat(getComputedStyle(target).paddingTop) || 0) - (header?.offsetHeight || 64) - 24);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(top, { duration: 0.85, lerp: 0, easing: t => 1 - Math.pow(1 - t, 3), immediate });
        wake();
      } else window.scrollTo({ top, behavior: reduced.matches || immediate ? "instant" : "smooth" });
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      navigate(url.hash, true);
    };
    const popstate = () => navigate(location.hash || "#main", false);
    document.addEventListener("click", click);
    window.addEventListener("popstate", popstate);

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".suite-reveal"));
    const reveal = (element: HTMLElement) => { element.dataset.reveal = "visible"; };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { reveal(entry.target as HTMLElement); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealElements.forEach(element => {
      if (reduced.matches || element.getBoundingClientRect().top < window.innerHeight) reveal(element);
      else { element.dataset.reveal = "pending"; observer.observe(element); }
    });
    const motionChange = () => {
      setupScroll();
      if (reduced.matches) { observer.disconnect(); revealElements.forEach(reveal); }
    };
    reduced.addEventListener("change", motionChange);

    const sectionLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".suite-sections a, .suite-mobile-sections a"));
    const sections = sectionLinks.map(link => ({ link, target: document.getElementById(link.hash.slice(1)) }));
    const update = () => {
      uiFrame = 0;
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--suite-progress", String(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0));
      header()?.toggleAttribute("data-scrolled", y > 24);
      document.querySelector(".suite-backtop")?.setAttribute("data-show", String(y > 700));
      let active = "";
      let closestTop = -Infinity;
      for (const { target } of sections) {
        const top = target?.getBoundingClientRect().top;
        if (target && top !== undefined && top < window.innerHeight * 0.35 && top > closestTop) {
          closestTop = top;
          active = target.id;
        }
      }
      sections.forEach(({ link, target }) => {
        if (target?.id === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const header = () => document.querySelector(".suite-header");
    const scroll = () => { if (!uiFrame) uiFrame = requestAnimationFrame(update); };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
      else wake();
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    document.addEventListener("visibilitychange", visibility);
    update();
    if (location.hash) navigate(location.hash, false, true);
    return () => {
      lenis?.destroy(); cancelAnimationFrame(frame); cancelAnimationFrame(uiFrame);
      observer.disconnect(); reduced.removeEventListener("change", motionChange);
      document.removeEventListener("click", click); window.removeEventListener("popstate", popstate);
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll);
      document.removeEventListener("visibilitychange", visibility);
      history.scrollRestoration = oldRestoration;
      root.style.removeProperty("--suite-progress");
    };
  }, []);
  return <a className="suite-backtop" href="#main" aria-label="Back to top" data-show="false"><ArrowUp size={18} aria-hidden="true" /><span>Top</span></a>;
}
