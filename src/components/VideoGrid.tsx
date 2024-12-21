import { useState, useEffect } from "react";
import { Video } from "../types/video";
import { VideoCard } from "./VideoCard";
import { updateVideo } from "../services/videoService";
import { supabase } from "@/integrations/supabase/client";

interface VideoGridProps {
  videos: Video[];
  highlightedVideoId?: string | null;
}

export const VideoGrid = ({ videos: initialVideos, highlightedVideoId }: VideoGridProps) => {
  const [videos, setVideos] = useState(initialVideos);

  useEffect(() => {
    setVideos(initialVideos);

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
          if (payload.eventType === 'INSERT') {
            setVideos(prev => [payload.new as Video, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setVideos(prev => prev.filter(video => video.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setVideos(prev => prev.map(video => 
              video.id === payload.new.id ? payload.new as Video : video
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialVideos]);

  const handleVideoUpdate = (updatedVideo: Video) => {
    const success = updateVideo(updatedVideo);
    if (success) {
      setVideos(videos.map(video => 
        video.id === updatedVideo.id ? updatedVideo : video
      ));
    }
  };

  const handleVideoDelete = (videoId: string) => {
    setVideos(videos.filter(video => video.id !== videoId));
  };

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