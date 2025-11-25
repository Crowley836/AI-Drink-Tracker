export enum DrinkType {
  BEER = 'Beer',
  WINE = 'Wine',
  LIQUOR = 'Liquor',
  MIXED = 'Mixed Drink',
  OTHER = 'Other'
}

export interface DrinkEntry {
  id: string;
  timestamp: number;
  name: string;
  type: DrinkType;
  volumeOz: number;
  abv: number;
  imageUrl?: string;
  notes?: string;
}

export interface DrinkAnalysisResult {
  name: string;
  type: DrinkType;
  volumeOz: number | null;
  abv: number | null;
  confidence: string;
}

export type ViewState = 'dashboard' | 'calendar' | 'insights' | 'add';
