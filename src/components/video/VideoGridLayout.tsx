import { Video } from "../../types/video";
import { VideoCard } from "../VideoCard";

interface VideoGridLayoutProps {
  videos: Video[];
  gridLayout: '2x2' | '3x2' | '4x2';
  highlightedVideoId?: string | null;
  onUpdate?: (video: Video) => void;
  onDelete?: (videoId: string) => void;
}

export const VideoGridLayout = ({ 
  videos, 
  gridLayout, 
  highlightedVideoId,
  onUpdate,
  onDelete 
}: VideoGridLayoutProps) => {
  const gridColumns = {
    '2x2': 'grid-cols-1 sm:grid-cols-2',
    '3x2': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4x2': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }[gridLayout];

  return (
    <div className={`grid ${gridColumns} gap-6`}>
      {videos.map((video) => (
        <div
          key={video.id}
          className={`transition-all duration-300 ${
            highlightedVideoId === video.id
              ? "ring-2 ring-primary ring-offset-2 rounded-lg transform scale-105"
              : ""
          }`}
        >
          <VideoCard 
            video={video} 
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};