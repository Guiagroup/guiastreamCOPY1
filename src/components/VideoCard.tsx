import { Video } from "../types/video";
import { useNavigate } from "react-router-dom";
import { HeroVideoCard } from "./video/HeroVideoCard";
import { RegularVideoCard } from "./video/RegularVideoCard";

interface VideoCardProps {
  video: Video;
  isHero?: boolean;
  onUpdate?: (updatedVideo: Video) => void;
  onDelete?: (videoId: string) => void;
}

export const VideoCard = ({ video, isHero = false, onUpdate, onDelete }: VideoCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/video/${video.id}`);
  };

  if (isHero) {
    return (
      <HeroVideoCard
        video={video}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <RegularVideoCard
      video={video}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onNavigate={handleNavigate}
    />
  );
};