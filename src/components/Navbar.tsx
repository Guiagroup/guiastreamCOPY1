import { useSession } from "@supabase/auth-helpers-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { MobileNav } from "./MobileNav";
import { NavLogo } from "./nav/NavLogo";
import { UserNav } from "./nav/UserNav";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onShowFavorites?: (show: boolean) => void;
  onSuggestionClick?: (query: string) => void;
}

export const Navbar = ({ onSearch, onShowFavorites, onSuggestionClick }: NavbarProps) => {
  const session = useSession();
  
  console.log("Session state:", session); // Debug log to check session

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <NavLogo />

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <LanguageSelector />
                <UserNav />
              </div>
              <div className="md:hidden">
                <MobileNav />
              </div>
            </>
          ) : (
            <>
              <ThemeToggle />
              <LanguageSelector />
              <MobileNav />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};