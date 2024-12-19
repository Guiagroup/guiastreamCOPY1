import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  selectedPlan: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const AuthForm = ({ selectedPlan, loading, setLoading }: AuthFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Validation error', {
        description: 'Please fill in all fields'
      });
      return false;
    }
    if (password.length < 6) {
      toast.error('Invalid password', {
        description: 'Password must be at least 6 characters long'
      });
      return false;
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
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
      </TabsContent>
      <TabsContent value="signup">
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
      </TabsContent>
    </Tabs>
  );
};