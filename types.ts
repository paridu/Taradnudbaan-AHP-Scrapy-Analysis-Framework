
export interface ScrapingProject {
  id: string;
  name: string;
  targetUrl: string;
  intent: string;
  status: 'active' | 'paused' | 'failed' | 'deploying';
  health: number; // 0-100
  lastRun: string;
  spiderCode: string;
  googleDriveEnabled?: boolean;
  investmentMetrics?: {
    totalItems: number;
    avgPriceGap: number;
    topRankingAssets: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  sources?: Array<{web: {uri: string, title: string}}>;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  AHP_RANKING = 'AHP_RANKING',
  LOGS = 'LOGS',
  DRIVE_EXPLORER = 'DRIVE_EXPLORER',
  SETTINGS = 'SETTINGS'
}
