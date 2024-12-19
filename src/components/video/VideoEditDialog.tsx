import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Video } from "../../types/video";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CategorySelector } from "../upload/CategorySelector";
import { supabase } from "@/integrations/supabase/client";

interface VideoEditDialogProps {
  video: Video;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedVideo: Video) => void;
}

export const VideoEditDialog = ({
  video,
  isOpen,
  onOpenChange,
  onUpdate,
}: VideoEditDialogProps) => {
  const { t } = useTranslation();
  const [editedTitle, setEditedTitle] = useState(video.title);
  const [editedDescription, setEditedDescription] = useState(video.description || '');
  const [editedVideoUrl, setEditedVideoUrl] = useState(video.video_url);
  const [editedCategory, setEditedCategory] = useState(video.category);
  const [newCategory, setNewCategory] = useState("");

  // Load form data from localStorage if available
  useEffect(() => {
    const savedForm = localStorage.getItem('videoEditForm');
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      setEditedTitle(parsedForm.title);
      setEditedDescription(parsedForm.description);
      setEditedVideoUrl(parsedForm.videoUrl);
      setEditedCategory(parsedForm.category);
      setNewCategory(parsedForm.newCategory);
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const formData = {
      title: editedTitle,
      description: editedDescription,
      videoUrl: editedVideoUrl,
      category: editedCategory,
      newCategory: newCategory,
    };
    localStorage.setItem('videoEditForm', JSON.stringify(formData));
  }, [editedTitle, editedDescription, editedVideoUrl, editedCategory, newCategory]);

  const handleSave = async () => {
    if (!editedTitle.trim() || !editedDescription.trim() || !editedVideoUrl.trim()) {
      toast.error(t('common.error'));
      return;
    }

    // Check user's plan and video count
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_type, uploads_used')
      .single();

    if (!profile) {
      toast.error("Unable to verify user plan");
      return;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${editedVideoUrl.split("v=")[1]}/maxresdefault.jpg`;

    const updatedVideo = {
      ...video,
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      video_url: editedVideoUrl.trim(),
      thumbnail_url: thumbnailUrl,
      category: newCategory.trim() || editedCategory,
    };
    
    onUpdate(updatedVideo);
    onOpenChange(false);
    localStorage.removeItem('videoEditForm'); // Clear form data after successful save
    toast.success(t('common.success'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('player.editVideo')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('upload.videoTitle')}</label>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder={t('upload.enterTitle')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('upload.description')}</label>
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder={t('upload.enterDescription')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('upload.videoUrl')}</label>
            <Input
              value={editedVideoUrl}
              onChange={(e) => setEditedVideoUrl(e.target.value)}
              placeholder={t('upload.enterUrl')}
            />
          </div>
          <CategorySelector
            category={editedCategory}
            setCategory={setEditedCategory}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('upload.cancel')}
          </Button>
          <Button onClick={handleSave}>{t('player.saveChanges')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};