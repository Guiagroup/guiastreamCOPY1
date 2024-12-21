import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import VideoPlayer from "./pages/VideoPlayer";
import Upload from "./pages/Upload";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PageLoader from "./components/PageLoader";
import "./i18n/config";
import { CookieConsent } from "./components/privacy/CookieConsent";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          const { data: user, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('User session invalid');
          }
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        toast.error('Session expired', {
          description: 'Please sign in again'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
        localStorage.removeItem('lastPath');
        setIsAuthenticated(false);
        navigate('/');
      } else if (event === 'SIGNED_IN' && session) {
        try {
          const { data: user, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('User session invalid');
          }
          setIsAuthenticated(true);
          navigate('/home');
        } catch (error) {
          console.error('Error verifying user:', error);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          toast.error('Authentication error', {
            description: 'Please sign in again'
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <PageLoader />;
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/pricing'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Redirect to auth if trying to access protected route while not authenticated
  if (!isAuthenticated && !isPublicRoute) {
    return <Auth />;
  }

  // Redirect to home if trying to access auth while authenticated
  if (isAuthenticated && location.pathname === '/auth') {
    navigate('/home');
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Index />} />
      <Route path="/video/:id" element={<VideoPlayer />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Add a catch-all route for 404s */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          const { data: user, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('User session invalid');
          }
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        await supabase.auth.signOut();
        toast.error('Authentication Error', {
          description: 'Please sign in again'
        });
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
              <AppRoutes />
            </BrowserRouter>
            <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;