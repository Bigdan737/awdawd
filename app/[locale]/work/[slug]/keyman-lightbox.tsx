"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type GalleryItem = readonly [string, string];

export function KeymanLightbox({ items }: { items: readonly GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [activeIndex, close, showPrev, showNext]);

  return (
    <>
      <div className="keyman-gallery__strip">
        {items.map(([src, alt], index) => (
          <button
            type="button"
            className={`keyman-gallery__item keyman-gallery__item--${index + 1}`}
            key={src}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open larger view: ${alt}`}
          >
            <Image src={src} alt={alt} fill unoptimized sizes="(max-width: 760px) 100vw, 22vw" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="keyman-lightbox" role="dialog" aria-modal="true" aria-label={items[activeIndex][1]}>
          <button
            type="button"
            className="keyman-lightbox__backdrop"
            onClick={close}
            aria-label="Close"
          />
          <div className="keyman-lightbox__content">
            <button type="button" className="keyman-lightbox__close" onClick={close} aria-label="Close">
              ×
            </button>
            <button
              type="button"
              className="keyman-lightbox__nav keyman-lightbox__nav--prev"
              onClick={showPrev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <div className="keyman-lightbox__image">
              <Image
                src={items[activeIndex][0]}
                alt={items[activeIndex][1]}
                fill
                unoptimized
                sizes="90vw"
                priority
              />
            </div>
            <button
              type="button"
              className="keyman-lightbox__nav keyman-lightbox__nav--next"
              onClick={showNext}
              aria-label="Next image"
            >
              ›
            </button>
            <p className="keyman-lightbox__caption">{items[activeIndex][1]}</p>
          </div>
        </div>
      )}
    </>
  );
}
