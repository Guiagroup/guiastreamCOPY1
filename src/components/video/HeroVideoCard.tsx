import { useState } from "react";
import { Video } from "../../types/video";
import { Button } from "../ui/button";
import { Edit, Heart, Trash } from "lucide-react";
import { VideoEditDialog } from "./VideoEditDialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
import { deleteVideo } from "../../services/videoService";

interface HeroVideoCardProps {
  video: Video;
  onUpdate?: (video: Video) => void;
  onDelete?: (videoId: string) => void;
  onNavigate?: () => void;
}

export const HeroVideoCard = ({ video, onUpdate, onDelete, onNavigate }: HeroVideoCardProps) => {
  const { t } = useTranslation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
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

  const handleVideoUpdate = (updatedVideo: Video) => {
    if (onUpdate) {
      onUpdate(updatedVideo);
    }
  };

  return (
    <>
      <div 
        onClick={onNavigate}
        className="relative group cursor-pointer rounded-lg overflow-hidden"
      >
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
            <p className="text-white/80 line-clamp-2 mb-4">{video.description}</p>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('player.edit')}
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                className="bg-white/10 hover:bg-white/20"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                {t('common.delete')}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <VideoEditDialog
        video={video}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleVideoUpdate}
      />

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