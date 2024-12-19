import { Video } from "../../types/video";
import { Play, Edit2, Heart, Trash } from "lucide-react";
import { useState } from "react";
import { VideoEditDialog } from "./VideoEditDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { deleteVideo } from "../../services/videoService";

interface RegularVideoCardProps {
  video: Video;
  onUpdate?: (updatedVideo: Video) => void;
  onDelete?: (videoId: string) => void;
  onNavigate: () => void;
}

export const RegularVideoCard = ({ 
  video, 
  onUpdate, 
  onDelete,
  onNavigate 
}: RegularVideoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const success = await deleteVideo(video.id);
    if (success) {
      if (onDelete) {
        onDelete(video.id);
      }
      toast.success("Video deleted successfully");
      if (window.location.pathname.includes(`/video/${video.id}`)) {
        window.location.href = '/';
      }
    } else {
      toast.error("Failed to delete video");
    }
    setShowDeleteDialog(false);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      const updatedVideo = {
        ...video,
        is_favorite: !video.is_favorite
      };
      onUpdate(updatedVideo);
      window.dispatchEvent(new Event('videoUpdated'));
    }
  };

  return (
    <>
      <div
        className="relative group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
        onClick={onNavigate}
      >
        <img
          src={video.thumbnail_url || getYouTubeThumbnail(video.video_url)}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-white font-semibold text-base sm:text-lg">{video.title}</h3>
            <span className="inline-block bg-primary/20 text-white px-2 py-0.5 rounded-full text-xs sm:text-sm mb-2">
              {video.category}
            </span>
            <p className="text-white/80 text-xs sm:text-sm line-clamp-2">{video.description}</p>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white hover:text-primary transition-colors" />
          </div>
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Trash className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
            <button
              onClick={handleEdit}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
            <button
              onClick={handleFavoriteClick}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Heart
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  video.is_favorite ? "text-red-500 fill-red-500" : "text-white"
                }`}
              />
            </button>
          </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};