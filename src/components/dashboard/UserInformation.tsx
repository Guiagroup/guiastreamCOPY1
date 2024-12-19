import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const UserInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    paymentMethod: "**** **** **** 4242",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserInfo(prev => ({
          ...prev,
          name: user.user_metadata.username || user.email?.split('@')[0] || "",
          email: user.email || "",
        }));
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: userInfo.name }
      });

      if (error) throw error;

      setIsEditing(false);
      toast.success("Changes saved successfully!");
    } catch (error: any) {
      toast.error("Error saving changes", {
        description: error.message
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          User Information
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={userInfo.name}
            onChange={(e) =>
              setUserInfo({ ...userInfo, name: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            value={userInfo.email}
            disabled={true}
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Method</label>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <Input
              value={userInfo.paymentMethod}
              disabled={true}
            />
          </div>
        </div>
        {isEditing && (
          <Button onClick={handleSaveChanges} className="w-full">
            Save Changes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};