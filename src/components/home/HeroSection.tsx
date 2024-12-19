import { Video } from "@/types/video";
import { VideoCard } from "../VideoCard";

interface HeroSectionProps {
  video: Video | null;
  isNewUser: boolean;
  showFavorites: boolean;
  fromSuggestion: boolean;
}

export const HeroSection = ({ video, isNewUser, showFavorites, fromSuggestion }: HeroSectionProps) => {
  if (isNewUser || showFavorites || fromSuggestion || !video) return null;
  
  return <VideoCard video={video} isHero={true} />;
};