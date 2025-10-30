export interface Problem {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface Branding {
  logoUrl: string;
  accentColor: string;
  companyName: string;
  backgroundUrl: string;
}

export interface Proposal {
  clientName: string;
  projectName: string;
  fullText: string;
}

export interface ProjectData {
  id: string;
  name: string;
  proposal: string;
  branding: string;
  selectedProblems: string;
  auditGoalText: string;
  trafficAnalysisText: string;
  growthPointsText: string;
  lastModified: any;
}
