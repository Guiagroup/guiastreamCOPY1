import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectPlan = async (plan: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth', { state: { plan } });
        return;
      }

      // For all plans, redirect to checkout
      try {
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
          body: { planType: plan }
        });

        if (checkoutError) throw checkoutError;
        if (checkoutData?.url) {
          // Store the current page state in localStorage before redirecting
          localStorage.setItem('lastVisitedPage', 'pricing');
          window.location.href = checkoutData.url;
          return;
        }
      } catch (error: any) {
        console.error('Error creating checkout:', error);
        toast.error('Checkout error', {
          description: 'Failed to create checkout session. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error(t('common.error'), {
        description: t('pricing.errorSelectingPlan')
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-foreground sm:text-4xl md:mx-auto">
            {t('pricing.title')}
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            {t('pricing.description')}
          </p>
        </div>

        <div className="grid max-w-screen-lg gap-10 md:grid-cols-3 sm:mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col justify-between p-5 bg-card rounded shadow-sm transition-transform hover:scale-105">
            <div className="mb-6">
              <div className="flex items-center justify-between pb-6 mb-6 border-b">
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase text-foreground">Free</p>
                  <p className="text-5xl font-bold text-foreground">€0<span className="text-sm font-normal">/mo</span></p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "10 video uploads per month",
                  "Basic video categorization",
                  "Standard support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-4 h-4 mr-3 text-green-500" />
                    <p className="text-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => handleSelectPlan('free')}
              className="w-full"
              variant="outline"
            >
              {t('pricing.selectPlan')}
            </Button>
          </div>

          {/* Basic Plan */}
          <div className="relative flex flex-col justify-between p-5 bg-card rounded shadow-sm transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium tracking-wider text-primary-foreground uppercase rounded-bl rounded-tr bg-primary">
              Popular
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between pb-6 mb-6 border-b">
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase text-foreground">Basic</p>
                  <p className="text-5xl font-bold text-foreground">€7.99<span className="text-sm font-normal">/mo</span></p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "100 video uploads per month",
                  "Advanced categorization",
                  "Priority support",
                  "Custom video thumbnails"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-4 h-4 mr-3 text-green-500" />
                    <p className="text-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => handleSelectPlan('basic')}
              className="w-full"
            >
              {t('pricing.startTrial')}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="flex flex-col justify-between p-5 bg-card rounded shadow-sm transition-transform hover:scale-105">
            <div className="mb-6">
              <div className="flex items-center justify-between pb-6 mb-6 border-b">
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase text-foreground">Premium</p>
                  <p className="text-5xl font-bold text-foreground">€9.99<span className="text-sm font-normal">/mo</span></p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "Unlimited video uploads",
                  "AI-powered categorization",
                  "24/7 Premium support",
                  "Advanced analytics",
                  "Custom branding options"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-4 h-4 mr-3 text-green-500" />
                    <p className="text-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => handleSelectPlan('premium')}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              {t('pricing.startTrial')}
            </Button>
          </div>
        </div>

        <p className="mt-8 text-xs text-center text-muted-foreground">
          {t('pricing.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default Pricing;