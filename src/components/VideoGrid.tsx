import { useState, useEffect } from "react";
import { Video } from "../types/video";
import { updateVideo } from "../services/videoService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmptyState } from "./home/EmptyState";
import { Loader2 } from "lucide-react";
import { GridLayoutControls } from "./video/GridLayoutControls";
import { VideoPagination } from "./video/VideoPagination";
import { VideoGridLayout } from "./video/VideoGridLayout";

interface VideoGridProps {
  videos: Video[];
  highlightedVideoId?: string | null;
}

type GridLayout = '2x2' | '3x2' | '4x2';

export const VideoGrid = ({ videos: initialVideos, highlightedVideoId }: VideoGridProps) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [gridLayout, setGridLayout] = useState<GridLayout>('3x2');

  const itemsPerPage = {
    '2x2': 4,
    '3x2': 6,
    '4x2': 8
  }[gridLayout];

  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = videos.slice(startIndex, endIndex);

  useEffect(() => {
    setVideos(initialVideos);
    setIsLoading(false);
  }, [initialVideos]);

  useEffect(() => {
    const channel = supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos'
        },
        (payload) => {
          try {
            if (payload.eventType === 'INSERT') {
              setVideos(prev => [payload.new as Video, ...prev]);
              toast.success('New video added');
            } else if (payload.eventType === 'DELETE') {
              setVideos(prev => prev.filter(video => video.id !== payload.old.id));
              toast.success('Video removed');
            } else if (payload.eventType === 'UPDATE') {
              setVideos(prev => prev.map(video => 
                video.id === payload.new.id ? payload.new as Video : video
              ));
              toast.success('Video updated');
            }
          } catch (err) {
            console.error('Error handling realtime update:', err);
            setError('Error updating videos');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVideoUpdate = async (updatedVideo: Video) => {
    try {
      const success = await updateVideo(updatedVideo);
      if (success) {
        setVideos(videos.map(video => 
          video.id === updatedVideo.id ? updatedVideo : video
        ));
        toast.success('Video updated successfully');
      } else {
        toast.error('Failed to update video');
      }
    } catch (err) {
      console.error('Error updating video:', err);
      toast.error('Failed to update video');
    }
  };

  const handleVideoDelete = (videoId: string) => {
    setVideos(videos.filter(video => video.id !== videoId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        {error}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <GridLayoutControls 
        gridLayout={gridLayout} 
        setGridLayout={setGridLayout} 
      />
      
      <VideoGridLayout
        videos={currentVideos}
        gridLayout={gridLayout}
        highlightedVideoId={highlightedVideoId}
        onUpdate={handleVideoUpdate}
        onDelete={handleVideoDelete}
      />

      <VideoPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};