import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, updateVideo } from "../services/videoService";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Video } from "@/types/video";
import { saveComment, getComments } from "../services/commentService";
import { VideoPlayerHeader } from "../components/video/VideoPlayerHeader";
import { VideoPlayerComments } from "../components/video/VideoPlayerComments";
import { VideoEditDialog } from "../components/video/VideoEditDialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VideoPlayer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const loadVideo = async () => {
      if (id) {
        const videoData = await getVideoById(id);
        setVideo(videoData);
        const savedComments = getComments(id);
        setComments(savedComments);
      }
    };
    loadVideo();

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [id]);

  const handleMessage = async (event: MessageEvent) => {
    if (event.origin !== "https://www.youtube.com") return;
    
    try {
      const data = JSON.parse(event.data);
      if (data.event === "onStateChange" && data.info === 2 && video) {
        // Video paused, save current time
        const currentTime = Math.floor(await getCurrentTime());
        if (currentTime > 0) {
          const updatedVideo = {
            ...video,
            last_played_position: currentTime
          };
          await updateVideo(updatedVideo);
        }
      }
    } catch (error) {
      console.error("Error handling YouTube message:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [video]);

  const getCurrentTime = (): Promise<number> => {
    return new Promise((resolve) => {
      if (!playerRef.current?.contentWindow) {
        resolve(0);
        return;
      }
      
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      playerRef.current.contentWindow.postMessage({
        event: "getCurrentTime",
        func: "getCurrentTime"
      }, "*", [messageChannel.port2]);
    });
  };

  if (!video) {
    return <div>{t('common.error')}</div>;
  }

  const videoId = video.video_url.split("v=")[1]?.split("&")[0];
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${video.last_played_position || 0}`;

  const handleLike = () => {
    if (video) {
      const updatedVideo = {
        ...video,
        is_favorite: !video.is_favorite
      };
      updateVideo(updatedVideo);
      setVideo(updatedVideo);
      window.dispatchEvent(new Event('videoUpdated'));
      toast.success(video.is_favorite ? t('common.unfavorite') : t('common.favorite'));
    }
  };

  const handleAddComment = (text: string) => {
    if (!id) return;

    const comment = {
      id: Date.now().toString(),
      text,
      author: "User",
      timestamp: new Date().toLocaleString(),
      videoId: id
    };

    saveComment(comment);
    setComments([comment, ...comments]);
    toast.success(t('common.success'));
  };

  const handleVideoUpdate = (updatedVideo: Video) => {
    setVideo(updatedVideo);
    updateVideo(updatedVideo);
    setIsEditing(false);
    toast.success(t('common.success'));
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="fixed inset-0 z-0">
        <img
          src={video.thumbnail_url || ''}
          alt={video.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
      </div>

      <div className="relative z-10 container mx-auto pt-24 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/home')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>

        <div className="aspect-video w-full max-w-5xl mx-auto mb-8 rounded-lg overflow-hidden shadow-2xl">
          <iframe
            ref={playerRef}
            className="w-full h-full"
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="max-w-5xl mx-auto">
          <VideoPlayerHeader
            video={video}
            onLike={handleLike}
            onEdit={() => setIsEditing(true)}
          />
          <p className="text-lg text-muted-foreground mb-8">{video.description}</p>

          <VideoPlayerComments
            comments={comments}
            onAddComment={handleAddComment}
          />
        </div>
      </div>

      <VideoEditDialog
        video={video}
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        onUpdate={handleVideoUpdate}
      />
    </div>
  );
};

export default VideoPlayer;