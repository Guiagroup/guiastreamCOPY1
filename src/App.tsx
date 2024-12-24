import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import PageLoader from "./components/PageLoader";
import "./i18n/config";
import { CookieConsent } from "./components/privacy/CookieConsent";
import { AuthStateProvider } from "./components/app/AuthStateProvider";
import { AppRoutes } from "./components/app/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!session);
        
        if (session) {
          const { data: user, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('User session invalid');
          }
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        await supabase.auth.signOut();
        setIsAuthenticated(false);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  if (initializing) {
    return <PageLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthStateProvider onAuthStateChange={setIsAuthenticated}>
                <AppRoutes isAuthenticated={isAuthenticated} />
              </AuthStateProvider>
            </BrowserRouter>
            <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;