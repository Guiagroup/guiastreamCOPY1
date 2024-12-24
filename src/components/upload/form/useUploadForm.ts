import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { addVideo } from "@/services/videoService";

export const useUploadForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (!session) {
        navigate('/auth');
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
    
    if (!isAuthenticated) {
      toast.error(t("auth.signInRequired"));
      navigate('/auth');
      return;
    }

    if (!title.trim() || !videoUrl.trim()) {
      toast.error(t("upload.requiredFields"));
      return;
    }

    if (!validateYouTubeUrl(videoUrl)) {
      toast.error(t("upload.invalidUrl"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan_type, uploads_used, monthly_upload_limit')
        .single();

      if (!profile) {
        toast.error(t("upload.profileError"));
        setIsSubmitting(false);
        return;
      }

      if (profile.uploads_used >= profile.monthly_upload_limit) {
        if (profile.plan_type === 'free') {
          toast.error(t("upload.freeLimitReached"), {
            description: t("upload.upgradeToAddMore"),
            action: {
              label: t("common.upgrade"),
              onClick: () => navigate('/pricing')
            }
          });
        } else if (profile.plan_type === 'basic') {
          toast.error(t("upload.basicLimitReached"), {
            description: t("upload.upgradeToPremium"),
            action: {
              label: t("common.upgrade"),
              onClick: () => navigate('/pricing')
            }
          });
        }
        setIsSubmitting(false);
        return;
      }

      const finalCategory = category || "Uncategorized";
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

      const success = await addVideo(newVideo);
      
      if (success) {
        toast.success(t("upload.successMessage"));
        localStorage.removeItem('uploadForm');
        navigate('/home');
      } else {
        throw new Error(t("upload.errorMessage"));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t("upload.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    videoUrl,
    setVideoUrl,
    category,
    setCategory,
    newCategory,
    setNewCategory,
    isSubmitting,
    handleSubmit,
  };
};