import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { useTranslation } from "react-i18next";

interface VideoTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

export const VideoTitleInput = ({ title, setTitle }: VideoTitleInputProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField label={t("upload.videoTitle")} required>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("upload.enterTitle")}
        required
        className="w-full"
      />
    </FormField>
  );
};