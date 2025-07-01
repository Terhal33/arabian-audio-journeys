
export interface Tour {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  distance: number;
  location: {
    lat: number;
    lng: number;
  };
  isPremium: boolean;
  points: {
    id: string;
    title: string;
    description: string;
    audioUrl: string;
    duration: number;
    location: {
      lat: number;
      lng: number;
    };
  }[];
  image_url?: string;
  region?: string;
  audio_url?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}
