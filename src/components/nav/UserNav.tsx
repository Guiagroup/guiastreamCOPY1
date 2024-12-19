import { useNavigate } from "react-router-dom";
import { Home, User, LogOut, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const UserNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error("Error signing out", {
        description: error.message
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/home')}
        className="transition-transform hover:scale-110"
      >
        <Home className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Home</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/upload')}
        className="transition-transform hover:scale-110"
      >
        <Plus className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Upload Video</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="transition-transform hover:scale-110"
          >
            <User className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};