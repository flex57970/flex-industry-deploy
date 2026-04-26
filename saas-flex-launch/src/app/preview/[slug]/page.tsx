import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { renderLandingHtml } from "@/lib/exporter/html";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [p] = await db
    .select({ name: projects.name, description: projects.description })
    .from(projects)
    .where(eq(projects.slug, params.slug))
    .limit(1);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: p.description,
  };
}

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, params.slug))
    .limit(1);

  if (!project) notFound();

  // If not published, only the owner can preview
  if (!project.published) {
    const user = await getCurrentUser();
    if (!user || user.id !== project.userId) notFound();
  }

  if (!project.content) notFound();

  const html = renderLandingHtml(project.name, project.content, {
    primaryColor: project.primaryColor ?? undefined,
    accentColor: project.accentColor ?? undefined,
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
