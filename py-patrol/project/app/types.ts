export interface Species {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  heatmapUrl: string; // Added heatmapUrl property
  dangerLevel: 'high' | 'medium' | 'low';
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  species: Species;
  status: 'verified' | 'pending';
}

export interface Report {
  id: string;
  species: Species;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  description: string;
  imageUrl?: string;
  status: 'verified' | 'pending';
  reportedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const COLORS = {
  primary: '#1B4332',      // Deep forest green
  secondary: '#2D6A4F',    // Rich emerald
  accent: '#52B788',       // Fresh leaf green
  background: '#F8FAF9',   // Clean off-white
  danger: '#DC2626',       // Alert red
  warning: '#F59E0B',      // Warning amber
  info: '#3B82F6',         // Info blue
  text: '#1F2937',         // Dark text
  textLight: '#6B7280',    // Light text
  border: '#E5E5E5',       // Border color
};