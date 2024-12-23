import { Video } from "../../types/video";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroVideoCardProps {
  video: Video;
  onUpdate?: (video: Video) => void;
  onDelete?: (videoId: string) => void;
  onNavigate?: () => void;
}

export const HeroVideoCard = ({ video, onUpdate, onDelete, onNavigate }: HeroVideoCardProps) => {
  const { t } = useTranslation();

  return (
    <div 
      onClick={onNavigate}
      className="relative group cursor-pointer rounded-lg overflow-hidden"
    >
      <img
        src={video.thumbnail_url}
        alt={video.title}
        className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
          <p className="text-white/80 line-clamp-2 mb-4">{video.description}</p>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                if (onUpdate) {
                  onUpdate({
                    ...video,
                    is_favorite: !video.is_favorite
                  });
                }
              }}
            >
              <Heart className={`h-4 w-4 ${video.is_favorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};