import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <Upload className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">No Videos Yet</h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        Start by uploading your first video. We support MP4 format for the best quality.
      </p>
      <Button onClick={() => navigate("/upload")} size="lg">
        Upload Your First Video
      </Button>
    </div>
  );
};