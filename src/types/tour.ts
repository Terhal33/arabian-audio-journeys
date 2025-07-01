
export interface Tour {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: number;
  region: string;
  audio_url?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}
