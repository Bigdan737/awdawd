"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global motion layer: smooth scroll, custom viewfinder cursor,
 * scroll-reveal for content blocks, and magnetic hover on buttons/cards.
 * Mounted once in the root layout — works across every route.
 */
export default function MotionProvider() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    // ---------- Smooth scroll ----------
    let lenis: Lenis | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // ---------- Custom cursor (desktop only) ----------
    let cursorCleanup = () => {};
    if (!isTouch && !prefersReduced) {
      cursorCleanup = initCursor(cursorRef.current);
    }

    // ---------- Scroll reveal ----------
    const revealTargets = gsap.utils.toArray<HTMLElement>(
      "[data-reveal], .home-hero .hero-copy > *, .home-project-card, .home-services-list a, .work-card, .service-card, section h2, section .eyebrow",
    );
    const seen = new Set<HTMLElement>();
    const ctx = gsap.context(() => {
      revealTargets.forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        gsap.set(el, { autoAlpha: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 24 });
        if (prefersReduced) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
            }),
        });
      });

      // Animated stat counters
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const target = parseFloat(el.dataset.counter || "0");
        if (!target) return;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              val: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.floor(obj.val).toString();
              },
            }),
        });
      });
    });

    // ---------- Word-by-word heading reveal ----------
    const splitCleanup = !prefersReduced ? initTextSplit() : () => {};

    // ---------- Magnetic hover ----------
    const magneticCleanup = !isTouch && !prefersReduced ? initMagnetic() : () => {};

    // ---------- Hero parallax ----------
    const parallaxCleanup = !prefersReduced ? initHeroParallax() : () => {};

    return () => {
      ctx.revert();
      cursorCleanup();
      magneticCleanup();
      parallaxCleanup();
      splitCleanup();
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <div ref={cursorRef} className="viewfinder-cursor" aria-hidden="true">
      <span className="vf-corner vf-tl" />
      <span className="vf-corner vf-tr" />
      <span className="vf-corner vf-bl" />
      <span className="vf-corner vf-br" />
      <span className="vf-dot" />
      <span className="vf-label">VIEW</span>
    </div>
  );
}

function initCursor(root: HTMLDivElement | null) {
  if (!root) return () => {};

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const rendered = { x: pos.x, y: pos.y };

  const quick = gsap.quickTo(root, "x", { duration: 0.35, ease: "power3.out" });
  const quickY = gsap.quickTo(root, "y", { duration: 0.35, ease: "power3.out" });

  const onMove = (e: MouseEvent) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    quick(pos.x);
    quickY(pos.y);
  };

  const interactiveSelector =
    'a, button, [role="button"], input, textarea, [data-cursor="view"]';

  const onOver = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest(interactiveSelector);
    if (target) {
      root.classList.add("is-active");
      if (target.matches('[data-cursor="view"], .home-project-card, .work-card')) {
        root.classList.add("is-view");
      }
    }
  };
  const onOut = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest(interactiveSelector);
    if (target) {
      root.classList.remove("is-active", "is-view");
    }
  };
  const onDown = () => root.classList.add("is-down");
  const onUp = () => root.classList.remove("is-down");
  const onLeaveWindow = () => root.classList.add("is-hidden");
  const onEnterWindow = () => root.classList.remove("is-hidden");

  window.addEventListener("mousemove", onMove);
  document.addEventListener("mouseover", onOver);
  document.addEventListener("mouseout", onOut);
  window.addEventListener("mousedown", onDown);
  window.addEventListener("mouseup", onUp);
  document.addEventListener("mouseleave", onLeaveWindow);
  document.addEventListener("mouseenter", onEnterWindow);

  document.documentElement.classList.add("has-custom-cursor");

  return () => {
    window.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("mouseout", onOut);
    window.removeEventListener("mousedown", onDown);
    window.removeEventListener("mouseup", onUp);
    document.removeEventListener("mouseleave", onLeaveWindow);
    document.removeEventListener("mouseenter", onEnterWindow);
    document.documentElement.classList.remove("has-custom-cursor");
  };
}

function initMagnetic() {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".button, .home-project-card, .home-services-list a, .work-card",
    ),
  );

  const handlers: Array<() => void> = [];

  els.forEach((el) => {
    const strength = el.classList.contains("button") ? 0.35 : 0.15;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    handlers.push(() => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    });
  });

  return () => handlers.forEach((fn) => fn());
}

function initHeroParallax() {
  const scene = document.querySelector<HTMLElement>(".camera-scene");
  if (!scene) return () => {};

  const img = scene.querySelector("img");
  if (!img) return () => {};

  const trigger = ScrollTrigger.create({
    trigger: scene,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    onUpdate: (self) => {
      gsap.set(img, { yPercent: self.progress * 14 - 7 });
    },
  });

  return () => trigger.kill();
}

function initTextSplit() {
  const targets = gsap.utils.toArray<HTMLElement>(
    "section h2, .scene-heading h2, .lead-magnet-copy h2",
  );

  const triggers: ScrollTrigger[] = [];

  targets.forEach((el) => {
    if (el.dataset.split === "done") return;
    const words = el.textContent?.split(/\s+/).filter(Boolean) ?? [];
    if (words.length < 2) return;

    el.dataset.split = "done";
    el.innerHTML = words
      .map((w) => `<span class="split-word"><span class="split-word-inner">${w}</span></span>`)
      .join(" ");

    const inners = el.querySelectorAll<HTMLElement>(".split-word-inner");
    gsap.set(inners, { yPercent: 110 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(inners, {
          yPercent: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.035,
        }),
    });
    triggers.push(trigger);
  });

  return () => triggers.forEach((t) => t.kill());
}
