import { getTownhouses } from "@/lib/data";
import { SalesToolView } from "@/components/SalesToolView";

export const dynamic = "force-dynamic";

export default async function InternalPage() {
  const townhouses = await getTownhouses();
  return <SalesToolView viewMode="internal" townhouses={townhouses} />;
}
