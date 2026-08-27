"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  categories,
  copy,
  type Category,
  type Locale,
  type Project,
} from "../../content";
import { Arrow, Footer, Header } from "../../site-ui";

function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = copy[locale];
  const content = (
    <>
      {project.image && (
        <Image
          src={project.slug === "keyman-chicago" ? "/media/keyman/keyman-hero-hd.png" : project.image}
          alt=""
          fill
          loading="eager"
          unoptimized
          sizes={project.featured ? "(max-width: 760px) 100vw, 100vw" : "(max-width: 760px) 100vw, 50vw"}
        />
      )}
      {project.visual === "keyman" && (
        <div className="project-placeholder project-keyman" aria-hidden="true">
          <span>KEYMAN</span>
          <strong>CHI</strong>
          <i>Studio notes / YouTube</i>
        </div>
      )}
      <div className="project-overlay">
        {project.featured && <span className="project-kicker">Featured project</span>}
        <h2>{project.title}</h2>
        <p>{project.services}</p>
        <span className="project-action">
          {project.published ? t.viewProject : t.coming} <Arrow />
        </span>
      </div>
    </>
  );

  const className = `project-card ${project.shape} ${project.featured ? "featured" : ""}`;
  return project.published ? (
    <Link className={className} data-project={project.slug} href={`/${locale}/work/${project.slug}`}>
      {content}
    </Link>
  ) : (
    <article className={className} data-project={project.slug}>{content}</article>
  );
}

export function WorkClient({
  locale,
  initialCategory,
  projects,
}: {
  locale: Locale;
  initialCategory: Category;
  projects: Project[];
}) {
  const t = copy[locale];
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? projects
        : projects.filter((project) => project.categories.includes(activeCategory)),
    [activeCategory, projects],
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const chooseCategory = (category: Category) => {
    setActiveCategory(category);
    setVisibleCount(9);
    const url = new URL(window.location.href);
    if (category === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", category);
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  };

  const loadMore = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setVisibleCount((value) => value + 6);
      setIsLoading(false);
    }, 320);
  };

  return (
    <main className="work-page">
      <Header locale={locale} />
      <section className="work-head">
        <div>
          <p className="eyebrow">Portfolio / 2022—2026</p>
          <h1>{t.workTitle}</h1>
          <p>{t.workIntro}</p>
        </div>
        <div className="filters" aria-label="Project categories">
          {categories.map((category) => (
            <button
              className={category.value === activeCategory ? "active" : ""}
              key={category.value}
              type="button"
              aria-pressed={category.value === activeCategory}
              onClick={() => chooseCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section className="project-grid" aria-live="polite">
        {visible.map((project) => (
          <ProjectCard project={project} locale={locale} key={project.slug} />
        ))}
      </section>

      {hasMore && (
        <div className="load-more-wrap">
          <button className="load-more" type="button" disabled={isLoading} onClick={loadMore}>
            {isLoading ? "Loading…" : t.load} <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
      <Footer locale={locale} />
    </main>
  );
}
