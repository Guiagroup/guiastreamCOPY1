import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pen, Cake, Film, Mic, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { toast } from "sonner";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const selectedPlan = location.state?.plan || 'free';

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (selectedPlan && selectedPlan !== 'free') {
          try {
            const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
              body: { planType: selectedPlan }
            });

            if (checkoutError) throw checkoutError;
            if (checkoutData?.url) {
              window.location.href = checkoutData.url;
              return;
            }
          } catch (error: any) {
            console.error('Error creating checkout session:', error);
            toast.error('Error creating checkout session', {
              description: error.message
            });
          }
        } else {
          navigate('/home');
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        if (selectedPlan && selectedPlan !== 'free') {
          navigate('/pricing');
        } else {
          navigate('/home');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, selectedPlan]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <Pen className="absolute top-[15%] left-[10%] w-16 h-16 opacity-50 rotate-[-15deg] animate-fade-in" />
        <Cake className="absolute top-[25%] right-[15%] w-12 h-12 opacity-50 rotate-12 animate-fade-in delay-100" />
        <Film className="absolute bottom-[30%] left-[20%] w-20 h-20 opacity-50 rotate-[-8deg] animate-fade-in delay-200" />
        <Mic className="absolute top-[45%] right-[25%] w-14 h-14 opacity-50 rotate-[15deg] animate-fade-in delay-300" />
        <Palette className="absolute bottom-[20%] right-[10%] w-16 h-16 opacity-50 rotate-[-20deg] animate-fade-in delay-400" />
      </div>

      <Card className="w-full max-w-md mx-auto animate-fade-in relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to GuiaStream
          </CardTitle>
          <CardDescription className="text-center">
            {selectedPlan !== 'free' 
              ? `Continue with ${selectedPlan} plan`
              : 'Get started for free'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm 
            selectedPlan={selectedPlan}
            loading={loading}
            setLoading={setLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;