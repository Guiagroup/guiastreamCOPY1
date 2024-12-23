import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const handleReturn = () => {
    if (session) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <h1 className="text-6xl font-bold text-primary animate-fade-in">404</h1>
        <h2 className="text-2xl font-semibold text-foreground animate-fade-in delay-100">
          Page Not Found
        </h2>
        <p className="text-muted-foreground animate-fade-in delay-200">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={handleReturn}
          className="animate-fade-in delay-300 gap-2"
          size="lg"
        >
          <Home className="w-4 h-4" />
          Return Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;