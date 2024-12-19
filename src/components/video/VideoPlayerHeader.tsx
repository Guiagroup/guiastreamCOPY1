import { Video } from "../../types/video";
import { ThumbsUp, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface VideoPlayerHeaderProps {
  video: Video;
  onLike: () => void;
  onEdit: () => void;
}

export const VideoPlayerHeader = ({ video, onLike, onEdit }: VideoPlayerHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-bold">{video.title}</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLike}
          className={video.is_favorite ? "text-primary" : ""}
        >
          <ThumbsUp className={`w-6 h-6 ${video.is_favorite ? 'fill-primary' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
        >
          <Edit2 className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};