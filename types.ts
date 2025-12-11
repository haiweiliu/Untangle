export interface ClassificationScores {
  my_domain: number;
  others_domain: number;
  life_domain: number;
}

export interface AgencyResult {
  classification: ClassificationScores;
  dominant_domain: '我的事' | '別人的事' | '天的事';
  one_sentence_reason: string;
  recommended_action: string;
  optional_reframe: string;
  timestamp?: string;
  original_input?: string;
}

export type ViewType = 'input' | 'processing' | 'result' | 'dashboard';
