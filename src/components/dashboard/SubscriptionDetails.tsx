import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  plan_type?: string;
  trial_status?: string;
  uploads_used?: number;
  monthly_upload_limit?: number;
}

interface SubscriptionDetailsProps {
  profile: Profile | null;
}

export const SubscriptionDetails = ({ profile }: SubscriptionDetailsProps) => {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(profile);

  // Fetch latest profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Fetched profile:', data);
      setCurrentProfile(data);
    };

    fetchProfile();
  }, []);

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  const handleCancelSubscription = () => {
    toast.success("Subscription cancelled successfully");
    navigate("/pricing");
  };

  const getPlanLimit = () => {
    if (!currentProfile?.monthly_upload_limit) {
      return currentProfile?.plan_type === 'premium' ? 'Unlimited' : 10;
    }
    return currentProfile.monthly_upload_limit === 2147483647 
      ? 'Unlimited' 
      : currentProfile.monthly_upload_limit;
  };

  const getTrialStatus = () => {
    if (!currentProfile) return '';
    if (currentProfile.trial_status === 'active') {
      return ' (Trial)';
    }
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
          <div>
            <p className="font-medium">Current Plan</p>
            <p className="text-2xl font-bold capitalize">
              {currentProfile?.plan_type || 'free'}{getTrialStatus()}
            </p>
          </div>
          <Button onClick={handleUpgrade} variant="outline">
            Upgrade Plan
          </Button>
        </div>

        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <div>
              <p className="font-medium">Video Upload Limit</p>
              <p>
                {currentProfile?.uploads_used || 0} / {getPlanLimit()} videos
              </p>
            </div>
          </div>
        </div>

        {currentProfile?.plan_type !== 'free' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Cancel Subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Cancel Subscription
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel your subscription? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {}}>
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                >
                  Yes, Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};