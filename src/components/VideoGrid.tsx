import { useState, useEffect } from "react";
import { Video } from "../types/video";
import { VideoCard } from "./VideoCard";
import { updateVideo } from "../services/videoService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmptyState } from "./home/EmptyState";
import { Loader2, Grid2x2, LayoutGrid, Grid } from "lucide-react";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

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

  const gridColumns = {
    '2x2': 'grid-cols-1 sm:grid-cols-2',
    '3x2': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4x2': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }[gridLayout];

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
      <div className="flex justify-end gap-2">
        <Button
          variant={gridLayout === '2x2' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setGridLayout('2x2')}
        >
          <Grid2x2 className="h-4 w-4" />
        </Button>
        <Button
          variant={gridLayout === '3x2' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setGridLayout('3x2')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={gridLayout === '4x2' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setGridLayout('4x2')}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>

      <div className={`grid ${gridColumns} gap-6`}>
        {currentVideos.map((video) => (
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

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};