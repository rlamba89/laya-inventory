import { getTownhouses } from "@/lib/data";
import { SalesToolView } from "@/components/SalesToolView";

export const dynamic = "force-dynamic";

export default async function InternalPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const townhouses = await getTownhouses(projectSlug);
  return <SalesToolView viewMode="internal" townhouses={townhouses} />;
}
