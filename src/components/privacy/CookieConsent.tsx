import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <p className="text-sm mb-4">
        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
      </p>
      <div className="flex justify-end space-x-4">
        <Button onClick={handleAccept} size="sm">
          Accept
        </Button>
      </div>
    </Card>
  );
};