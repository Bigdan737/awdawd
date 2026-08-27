"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from "react";
import { copy, projects as staticProjects, type Locale, type Project } from "./content";

export function EditTimeline({ locale, projects }: { locale: Locale; projects?: Project[] }) {
  const t = copy[locale];
  const clips = (projects ?? staticProjects).filter((p) => p.image).slice(0, 8);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const index = Math.min(Math.round(ratio * (clips.length - 1)), clips.length - 1);
    setActive(index);
  };

  const onDown = (e: ReactMouseEvent | ReactTouchEvent) => {
    dragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setFromClientX(clientX);
  };
  const onMove = (e: ReactMouseEvent | ReactTouchEvent) => {
    if (!dragging.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setFromClientX(clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  const activeProject = clips[active];

  return (
    <section className="edit-scene" data-reveal data-scene="edit">
      <div className="scene-heading">
        <p className="eyebrow">{t.editEyebrow}</p>
        <h2>{t.editTitle}</h2>
        <p className="scene-copy">{t.editCopy}</p>
      </div>

      <div className="edit-preview">
        {activeProject?.image && (
          <Image
            key={activeProject.slug}
            src={activeProject.image}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 900px) 100vw, 70vw"
          />
        )}
        <div className="edit-preview-overlay">
          <span className="edit-timecode">
            {String(active + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
          </span>
          <strong>{activeProject?.title}</strong>
        </div>
      </div>

      <div
        className="edit-track"
        ref={trackRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <div className="edit-track-line" />
        <div
          className="edit-playhead"
          style={{ left: `${(active / (clips.length - 1)) * 100}%` }}
        />
        <div className="edit-clips">
          {clips.map((clip, index) => (
            <button
              key={clip.slug}
              type="button"
              className={`edit-clip ${index === active ? "is-active" : ""}`}
              onClick={() => setActive(index)}
            >
              {clip.image && (
                <Image src={clip.image} alt="" fill unoptimized sizes="120px" />
              )}
            </button>
          ))}
        </div>
      </div>
      <p className="edit-hint">{t.editHint}</p>
    </section>
  );
}
