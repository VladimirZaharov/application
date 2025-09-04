export interface Problem {
  id: string;
  title: string;
  category: string;
  description: string;
  screenshotUrl?: string;
}

export interface Branding {
  logoUrl: string;
  accentColor: string;
  companyName: string;
}

export interface Proposal {
  clientName: string;
  projectName: string;
  fullText: string;
}
