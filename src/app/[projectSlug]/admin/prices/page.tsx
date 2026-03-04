import { getAdminUnits } from "@/lib/data";
import { PricesManager } from "@/components/admin/PricesManager";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const units = await getAdminUnits(projectSlug);

  return <PricesManager initialUnits={units} projectSlug={projectSlug} />;
}
