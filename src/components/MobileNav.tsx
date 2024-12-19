import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Plus, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import PricingDialog from "./pricing/PricingDialog";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function MobileNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const session = useSession();

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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-3 border-b pb-4">
            <Button variant="ghost" className="justify-start" asChild>
              <a href={session ? "/home" : "/"} className="font-bold text-xl text-primary">
                GuiaStream
              </a>
            </Button>
            <PricingDialog />
          </div>
          <div className="flex flex-col space-y-3">
            {session ? (
              <>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/home')}>
                  <Home className="mr-2 h-4 w-4" />
                  {t('nav.home')}
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/upload')}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('nav.upload')}
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  {t('nav.dashboard')}
                </Button>
                <Button className="justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/auth')}>
                  {t('nav.signIn')}
                </Button>
                <Button className="justify-start" onClick={() => navigate('/auth')}>
                  {t('nav.signUp')}
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}