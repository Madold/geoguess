export interface GameHistoryItem {
  id: number;
  game_date: string;
  final_score: number;
  game_mode_name: string;
  difficulty_level: string;
  total_time_seconds: number;
  detailed_statistics?: {
    accuracy?: number;
    questions?: Array<{
      country?: string;
      locationName?: string;
    }>;
  };
}

export interface Statistics {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  averageAccuracy: number;
}

export interface GameHistoryResponse {
  gameHistory: GameHistoryItem[];
  statistics: Statistics | null;
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

