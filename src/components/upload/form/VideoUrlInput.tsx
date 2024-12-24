import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { useTranslation } from "react-i18next";

interface VideoUrlInputProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

export const VideoUrlInput = ({ videoUrl, setVideoUrl }: VideoUrlInputProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField label={t("upload.videoUrl")} required>
      <Input
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
        required
        className="w-full"
      />
    </FormField>
  );
};