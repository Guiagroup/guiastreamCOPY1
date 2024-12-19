import { useState, useEffect } from "react";
import { VideoGrid } from "../components/VideoGrid";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getLatestVideo, getVideos } from "../services/videoService";
import { getCategories } from "../services/categoryService";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "@/components/search/SearchBar";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import { EmptyState } from "@/components/home/EmptyState";
import { toast } from "sonner";
import { Video } from "@/types/video";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedVideoId = searchParams.get('highlight');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [fromSuggestion, setFromSuggestion] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [latestVideo, setLatestVideo] = useState<Video | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedVideos, latest, cats] = await Promise.all([
          getVideos(),
          getLatestVideo(),
          getCategories()
        ]);
        
        setVideos(fetchedVideos);
        setLatestVideo(latest);
        setCategories(cats);
        setIsNewUser(fetchedVideos.length === 0);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [t]);

  const displayVideos = videos.filter(video => {
    if (latestVideo && video.id === latestVideo.id) return false;
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesFavorites = !showFavorites || video.is_favorite;
    return matchesCategory && matchesFavorites;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onShowFavorites={setShowFavorites} />
      <main className="flex-grow pt-16">
        <HeroSection 
          video={latestVideo}
          isNewUser={isNewUser}
          showFavorites={showFavorites}
          fromSuggestion={fromSuggestion}
        />
        <div className="container mx-auto py-8">
          {!isNewUser && (
            <>
              <div className="flex justify-start mb-6">
                <SearchBar />
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </>
          )}
          {isNewUser ? (
            <EmptyState />
          ) : (
            <VideoGrid videos={displayVideos} highlightedVideoId={highlightedVideoId} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;