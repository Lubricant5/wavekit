export interface BaguaZone {
  direction: string;
  element: string;
  lifeArea: string;
  currentState: string;
  energyRating: "Strong" | "Weak" | "Balanced";
}

export interface ColorRecommendation {
  currentColor: string;
  recommendedColor: string;
  element: string;
  reasoning: string;
  urgency: "High" | "Medium" | "Low";
}

export interface FurnitureArrangement {
  item: string;
  currentPosition: string;
  recommendedAction: "Move" | "Keep" | "Remove";
  targetRoom: string;
  targetPosition: string;
  reason: string;
}

export interface ElementBalance {
  wood: "Excess" | "Balanced" | "Deficient";
  fire: "Excess" | "Balanced" | "Deficient";
  earth: "Excess" | "Balanced" | "Deficient";
  metal: "Excess" | "Balanced" | "Deficient";
  water: "Excess" | "Balanced" | "Deficient";
}

export interface ActionRecommendation {
  priority: number;
  category: string;
  action: string;
  benefit: string;
}

export interface ShoppingRecommendation {
  item: string;
  purpose: string;
  element: string;
  placement: string;
  priceRange: "Budget" | "Mid-range" | "Premium";
  lifeAreaBenefit: string;
  searchKeywords: string;
}

export interface FengShuiAnalysis {
  overallScore: number;
  overallAssessment: string;
  chiFlow: {
    rating: "Good" | "Fair" | "Poor";
    description: string;
    blockages: string[];
  };
  baguaAnalysis: {
    dominantArea: string;
    activeZones: BaguaZone[];
  };
  colorRecommendations: ColorRecommendation[];
  furnitureArrangement: FurnitureArrangement[];
  elementBalance: ElementBalance;
  recommendations: ActionRecommendation[];
  shoppingRecommendations: ShoppingRecommendation[];
  quickWins: string[];
  avoidList: string[];
}
