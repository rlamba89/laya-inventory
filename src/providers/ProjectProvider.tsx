"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { Project, GroupType, Group, ReleaseStatus } from "@/lib/types";

export interface StageInfo {
  release_status: ReleaseStatus;
  visible_to_clients: boolean;
  release_date: string | null;
  group_id: string | null;
  name: string;
}

const DEFAULT_STAGE_INFO: StageInfo = {
  release_status: "now_selling",
  visible_to_clients: true,
  release_date: null,
  group_id: null,
  name: "",
};

interface ProjectContextValue {
  project: Project;
  groupTypes: GroupType[];
  groups: Group[];
  /** Get groups by their type slug (e.g., "stage", "area") */
  getGroupsByType: (slug: string) => Group[];
  /** Get release info for a stage number (1, 2, 3...). Falls back to "now_selling" if groups not configured */
  getStageInfo: (stageNumber: number) => StageInfo;
  /** All stage groups sorted by sort_order */
  stages: Group[];
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({
  children,
  project,
  groupTypes,
  groups,
}: {
  children: ReactNode;
  project: Project;
  groupTypes: GroupType[];
  groups: Group[];
}) {
  const getGroupsByType = (slug: string) => {
    const type = groupTypes.find((gt) => gt.slug === slug);
    if (!type) return [];
    return groups
      .filter((g) => g.group_type_id === type.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const stages = useMemo(() => getGroupsByType("stage"), [groupTypes, groups]);

  // Build a map from stage number → Group for quick lookup
  // Stage names are expected to be "Stage 1", "Stage 2", etc.
  const stageMap = useMemo(() => {
    const map = new Map<number, Group>();
    for (const g of stages) {
      const num = parseInt(g.name.replace(/\D/g, ""));
      if (!isNaN(num)) map.set(num, g);
    }
    return map;
  }, [stages]);

  const getStageInfo = (stageNumber: number): StageInfo => {
    const group = stageMap.get(stageNumber);
    if (!group) return { ...DEFAULT_STAGE_INFO, name: `Stage ${stageNumber}` };
    return {
      release_status: group.release_status,
      visible_to_clients: group.visible_to_clients,
      release_date: group.release_date,
      group_id: group.id,
      name: group.name,
    };
  };

  return (
    <ProjectContext.Provider value={{ project, groupTypes, groups, getGroupsByType, getStageInfo, stages }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within ProjectProvider");
  return context;
}
