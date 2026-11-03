export interface ServiceStats {
  rating: number;
  reviews: number;
}

export const SERVICE_STATS: Record<string, ServiceStats> = {
  food: { rating: 4.9, reviews: 1280 },
  fuel: { rating: 4.8, reviews: 940 },
  solar: { rating: 4.9, reviews: 212 },
  health: { rating: 4.7, reviews: 655 },
  gifts: { rating: 4.8, reviews: 430 },
  flowers: { rating: 4.6, reviews: 318 },
  meals: { rating: 4.9, reviews: 1105 },
  direct_support: { rating: 4.9, reviews: 1420 },
  sponsorship: { rating: 4.9, reviews: 760 },
  urgent_medical: { rating: 4.8, reviews: 590 },
  student_support: { rating: 4.7, reviews: 275 },
  request_help: { rating: 4.8, reviews: 1010 },
  heating: { rating: 4.8, reviews: 845 },
};

export function getServiceStats(id: string): ServiceStats {
  return SERVICE_STATS[id] ?? { rating: 4.8, reviews: 0 };
}
