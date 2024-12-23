import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateAuthForm } from "@/utils/authValidation";

interface SignInFormProps {
  selectedPlan: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignInForm = ({ selectedPlan, loading, setLoading }: SignInFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAuthForm(email, password)) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

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
          console.error('Error creating checkout:', error);
          toast.error('Checkout error', {
            description: 'Failed to create checkout session. Please try again.'
          });
        }
      } else {
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error('Sign in failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};