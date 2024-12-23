import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateAuthForm } from "@/utils/authValidation";

interface SignUpFormProps {
  selectedPlan: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignUpForm = ({ selectedPlan, loading, setLoading }: SignUpFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAuthForm(email, password)) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            plan_type: selectedPlan || 'free',
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      toast.success("Success", {
        description: "Please check your email to verify your account"
      });
      
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
      console.error('Error signing up:', error);
      toast.error('Sign up failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
};