import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { UserInformation } from "@/components/dashboard/UserInformation";
import { SubscriptionDetails } from "@/components/dashboard/SubscriptionDetails";
import { useNavigate } from "react-router-dom";
import { getVideos } from "@/services/videoService";
import { toast } from "sonner";
import { Video } from "@/types/video";

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
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
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);

      // Check if video limit is reached
      if (videos.length >= (data.monthly_upload_limit || 10)) {
        toast.error("Video upload limit reached", {
          description: "Please upgrade your plan to add more videos",
          action: {
            label: "Upgrade",
            onClick: () => navigate('/pricing')
          }
        });
      }
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
        <UserInformation />
        <SubscriptionDetails profile={profile} />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;