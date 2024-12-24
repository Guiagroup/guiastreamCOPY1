import { Textarea } from "@/components/ui/textarea";
import { FormField } from "../FormField";
import { useTranslation } from "react-i18next";

interface VideoDescriptionInputProps {
  description: string;
  setDescription: (description: string) => void;
}

export const VideoDescriptionInput = ({ description, setDescription }: VideoDescriptionInputProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField label={t("upload.description")}>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("upload.enterDescription")}
        className="w-full"
      />
    </FormField>
  );
};