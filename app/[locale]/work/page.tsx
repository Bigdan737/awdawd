import type { Metadata } from "next";
import { categories, getLocale, type Category } from "../../content";
import { getAllProjects } from "../../../lib/site-projects";
import { WorkClient } from "./work-client";

export const metadata: Metadata = {
  title: "Our Work",
  description: "An editorial archive of PRODUP projects across content, AI, web and brand.",
};

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { category } = await searchParams;
  const locale = getLocale(rawLocale);
  const allowed = categories.some((item) => item.value === category);
  const initialCategory = (allowed ? category : "all") as Category;
  const projects = await getAllProjects(locale);

  return <WorkClient locale={locale} initialCategory={initialCategory} projects={projects} />;
}
