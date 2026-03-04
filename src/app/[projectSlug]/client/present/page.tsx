import { getTownhouses } from "@/lib/data";
import { PresentationView } from "@/components/presentation/PresentationView";

export const dynamic = "force-dynamic";

export default async function PresentPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const townhouses = await getTownhouses(projectSlug);
  return <PresentationView townhouses={townhouses} />;
}
