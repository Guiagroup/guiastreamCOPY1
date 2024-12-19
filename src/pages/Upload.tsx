import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useTranslation } from "react-i18next";
import { UploadForm } from "@/components/upload/UploadForm";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">{t("upload.title")}</h1>
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;