import { getTownhouses } from "@/lib/data";
import { SalesToolView } from "@/components/SalesToolView";

export const dynamic = "force-dynamic";

export default async function ClientPage() {
  const townhouses = await getTownhouses();
  return <SalesToolView viewMode="client" townhouses={townhouses} />;
}
