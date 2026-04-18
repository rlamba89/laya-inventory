import { getAdminUnits, getProjectData } from "@/lib/data";
import { notFound } from "next/navigation";
import { AgentsManager } from "@/components/admin/AgentsManager";

export const dynamic = "force-dynamic";

export default async function AdminAgentsPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const [projectData, units] = await Promise.all([
    getProjectData(projectSlug),
    getAdminUnits(projectSlug),
  ]);

  if (!projectData) notFound();

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Outside Agents</h1>
        <p className="text-xs text-stone mt-1">
          Reserve units for external agents or partner companies. Assigned units will show an agent
          tag on both internal and client dashboards.
        </p>
      </header>

      <AgentsManager
        projectSlug={projectSlug}
        unitLabelShort={projectData.project.unit_label_short}
        units={units}
      />
    </div>
  );
}
