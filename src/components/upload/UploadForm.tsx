import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { CategorySelector } from "./CategorySelector";
import { VideoTitleInput } from "./form/VideoTitleInput";
import { VideoDescriptionInput } from "./form/VideoDescriptionInput";
import { VideoUrlInput } from "./form/VideoUrlInput";
import { useUploadForm } from "./form/useUploadForm";
import { Loader2 } from "lucide-react";

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export const UploadForm = ({ onUploadSuccess }: UploadFormProps) => {
  const { t } = useTranslation();
  const {
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
  } = useUploadForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VideoTitleInput title={title} setTitle={setTitle} />
      <VideoDescriptionInput description={description} setDescription={setDescription} />
      <VideoUrlInput videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      <CategorySelector
        category={category}
        setCategory={setCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
      />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("upload.uploading")}
          </>
        ) : (
          t("upload.add")
        )}
      </Button>
    </form>
  );
};