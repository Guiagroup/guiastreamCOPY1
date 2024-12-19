import { Video } from "../../types/video";
import { useTranslation } from "react-i18next";
import { Edit2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { VideoEditDialog } from "./VideoEditDialog";

interface HeroVideoCardProps {
  video: Video;
  onNavigate: () => void;
  onUpdate?: (updatedVideo: Video) => void;
  onDelete?: (videoId: string) => void;
}

export const HeroVideoCard = ({ video, onNavigate, onUpdate }: HeroVideoCardProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <>
      <div className="relative w-full h-[50vh] md:h-[70vh] cursor-pointer group" onClick={onNavigate}>
        <div className="absolute inset-0">
          <img
            src={video.thumbnail_url || ''}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{video.title}</h1>
            <span className="inline-block bg-primary/20 text-white px-3 py-1 rounded-full text-sm mb-4">
              {video.category}
            </span>
            <p className="text-base md:text-lg text-white/80 mb-6 max-w-2xl line-clamp-2 md:line-clamp-none">
              {video.description}
            </p>
            <button className="bg-primary hover:bg-primary-dark dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white px-6 py-2 md:px-8 md:py-3 rounded-md transition-colors">
              {t('player.playNow')}
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit2 className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {onUpdate && (
        <VideoEditDialog
          video={video}
          isOpen={isEditing}
          onOpenChange={setIsEditing}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};