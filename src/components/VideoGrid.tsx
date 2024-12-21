import { useState, useEffect } from "react";
import { Video } from "../types/video";
import { VideoCard } from "./VideoCard";
import { updateVideo } from "../services/videoService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmptyState } from "./home/EmptyState";
import { Loader2 } from "lucide-react";

interface VideoGridProps {
  videos: Video[];
  highlightedVideoId?: string | null;
}

export const VideoGrid = ({ videos: initialVideos, highlightedVideoId }: VideoGridProps) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVideos(initialVideos);
    setIsLoading(false);
  }, [initialVideos]);

  useEffect(() => {
    // Subscribe to real-time video updates
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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
            onUpdate={handleVideoUpdate}
            onDelete={handleVideoDelete}
          />
        </div>
      ))}
    </div>
  );
};