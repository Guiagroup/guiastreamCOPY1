import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Video } from "@/types/video";
import { addVideo } from "@/services/videoService";
import { useTranslation } from "react-i18next";
import { CategorySelector } from "./CategorySelector";
import { FormField } from "./FormField";
import { useNavigate } from "react-router-dom";

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export const UploadForm = ({ onUploadSuccess }: UploadFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateYouTubeUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
  };

  const getYouTubeThumbnail = (url: string) => {
    let videoId = '';
    if (url.includes('youtube.com')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !videoUrl.trim() || (!category && !newCategory)) {
      toast.error(t("upload.requiredFields"));
      return;
    }

    if (!validateYouTubeUrl(videoUrl)) {
      toast.error("Invalid URL", {
        description: "Please enter a valid YouTube URL"
      });
      return;
    }

    setIsSubmitting(true);

    const finalCategory = newCategory || category;
    const thumbnailUrl = getYouTubeThumbnail(videoUrl.trim());

    const newVideo = {
      title: title.trim(),
      description: description.trim(),
      video_url: videoUrl.trim(),
      thumbnail_url: thumbnailUrl,
      category: finalCategory,
      is_favorite: false,
      upload_date: new Date().toISOString(),
      last_played_position: 0 // Added this field with initial value of 0
    };

    try {
      const success = await addVideo(newVideo);
      if (success) {
        toast.success(t("upload.successMessage"));
        onUploadSuccess?.();
        navigate('/home');
      } else {
        toast.error(t("upload.errorMessage"));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t("upload.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label={t("upload.videoTitle")}
        required
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("upload.enterTitle")}
          required
          className="w-full"
        />
      </FormField>

      <FormField
        label={t("upload.description")}
      >
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("upload.enterDescription")}
          className="w-full"
        />
      </FormField>

      <FormField
        label={t("upload.videoUrl")}
        required
      >
        <Input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
          required
          className="w-full"
        />
      </FormField>

      <CategorySelector
        category={category}
        setCategory={setCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("upload.uploading") : t("upload.submit")}
      </Button>
    </form>
  );
};