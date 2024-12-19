import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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

  // Load form data from localStorage if available
  useEffect(() => {
    const savedForm = localStorage.getItem('uploadForm');
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      setTitle(parsedForm.title || "");
      setDescription(parsedForm.description || "");
      setVideoUrl(parsedForm.videoUrl || "");
      setCategory(parsedForm.category || "");
      setNewCategory(parsedForm.newCategory || "");
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const formData = {
      title,
      description,
      videoUrl,
      category,
      newCategory,
    };
    localStorage.setItem('uploadForm', JSON.stringify(formData));
  }, [title, description, videoUrl, category, newCategory]);

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

    // Check user's plan and video count
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_type, uploads_used, monthly_upload_limit')
      .single();

    if (!profile) {
      toast.error("Unable to verify user plan");
      return;
    }

    if (profile.uploads_used >= profile.monthly_upload_limit) {
      if (profile.plan_type === 'free') {
        toast.error("Free plan limit reached", {
          description: "Please upgrade to add more videos",
          action: {
            label: "Upgrade",
            onClick: () => navigate('/pricing')
          }
        });
      } else if (profile.plan_type === 'basic') {
        toast.error("Basic plan limit reached", {
          description: "Please upgrade to premium for unlimited videos",
          action: {
            label: "Upgrade",
            onClick: () => navigate('/pricing')
          }
        });
      }
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
      last_played_position: 0
    };

    try {
      const success = await addVideo(newVideo);
      if (success) {
        toast.success(t("upload.successMessage"));
        localStorage.removeItem('uploadForm'); // Clear form data after successful upload
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
        {isSubmitting ? t("upload.uploading") : "Add"}
      </Button>
    </form>
  );
};