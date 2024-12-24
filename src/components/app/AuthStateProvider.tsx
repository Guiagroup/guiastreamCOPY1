import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageLoader from "../PageLoader";

interface AuthStateProviderProps {
  children: React.ReactNode;
  onAuthStateChange: (isAuthenticated: boolean | null) => void;
}

export const AuthStateProvider = ({ children, onAuthStateChange }: AuthStateProviderProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        onAuthStateChange(!!session);
        
        if (session) {
          const { data: user, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('User session invalid');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        await supabase.auth.signOut();
        onAuthStateChange(false);
        toast.error('Session expired', {
          description: 'Please sign in again'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        onAuthStateChange(false);
        navigate('/');
      } else if (event === 'SIGNED_IN' && session) {
        try {
          const { data: user, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('User session invalid');
          }
          onAuthStateChange(true);
          navigate('/home');
        } catch (error) {
          console.error('Error verifying user:', error);
          await supabase.auth.signOut();
          onAuthStateChange(false);
          toast.error('Authentication error', {
            description: 'Please sign in again'
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, onAuthStateChange]);

  if (isLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};