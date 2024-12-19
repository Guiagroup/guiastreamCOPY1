export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  upload_date: string | null;
  is_favorite: boolean | null;
  last_played_position: number;
}