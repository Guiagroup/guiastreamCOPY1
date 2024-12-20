import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { SubscriptionDetails } from "@/components/dashboard/SubscriptionDetails";
import { PasswordChange } from "@/components/dashboard/PasswordChange";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    };

    fetchData();
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto py-10 px-4 space-y-8 animate-fade-in pt-20">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <SubscriptionDetails profile={profile} />
          <PasswordChange />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;