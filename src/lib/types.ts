import type {Dispatch, SetStateAction} from "react";

export interface Problem {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface ProjectsList {
  id: number;
  project_name: string;
  updated_at: string;
}

export interface ProjectData {
  id: number;
  company_name: string;
  client_name: string;
  project_name: string;
  audit_goal: string;
  traffic_analysis: string;
  grow_points: string;
  logo_url: string;
  background_url: string;
  color: string;
  created_at: string;
  updated_at: string;
  problems: {
    [name: string]: {
      id: number;
      project_id: number;
      content: string;
      screenshot_html: string;
      is_selected: Buffer;
    };
  };
}
export interface PageProps {
  params: Promise<{
    projectId: string;
    projectName: string;
  }>;
}

export interface EditorSidebarProps {
  projectData: ProjectData,
  adjustTone: (tone: string) => Promise<void>;
  isAdjustingTone: boolean;
}
