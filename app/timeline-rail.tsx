"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { id: "idea", label: "IDEA", selector: '[data-scene="idea"]' },
  { id: "shoot", label: "SHOOT", selector: '[data-scene="shoot"]' },
  { id: "edit", label: "EDIT", selector: '[data-scene="edit"]' },
  { id: "final", label: "FINAL", selector: '[data-scene="final"]' },
];

export function TimelineRail() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const targets = STAGES.map((stage) => document.querySelector(stage.selector)).filter(
      Boolean,
    ) as Element[];

    if (targets.length < 2) return;
    setReady(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = targets.indexOf(entry.target);
          if (index !== -1) setActive(index);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  if (!ready) return null;

  return (
    <nav className="timeline-rail" aria-label="Page progress">
      <div className="timeline-rail-line">
        <div
          className="timeline-rail-fill"
          style={{ height: `${(active / (STAGES.length - 1)) * 100}%` }}
        />
      </div>
      {STAGES.map((stage, index) => (
        <button
          key={stage.id}
          type="button"
          className={`timeline-rail-point ${index === active ? "is-active" : ""} ${index < active ? "is-past" : ""}`}
          style={{ top: `${(index / (STAGES.length - 1)) * 100}%` }}
          onClick={() => document.querySelector(stage.selector)?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="timeline-rail-dot" />
          <span className="timeline-rail-label">{stage.label}</span>
        </button>
      ))}
    </nav>
  );
}
