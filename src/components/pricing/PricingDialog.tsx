import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PricingDialog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectPlan = async (plan: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth', { state: { plan } });
        return;
      }

      if (plan === 'free') {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan_type: plan,
          })
          .eq('id', user.id);

        if (error) throw error;

        toast.success('Plan updated successfully', {
          description: 'You are now on the Free plan'
        });
        navigate('/dashboard');
      } else {
        // For paid plans, redirect to checkout
        try {
          const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
            body: { planType: plan }
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
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error('Error', {
        description: 'Failed to update plan. Please try again.'
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {t('nav.pricing')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] overflow-y-auto">
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
              Choose the Perfect Plan for Your Needs
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 md:text-lg">
              Select a plan that best suits your video management requirements
            </p>
          </div>
          <div className="grid max-w-screen-md gap-10 md:grid-cols-3 sm:mx-auto">
            {/* Free Plan */}
            <div className="flex flex-col justify-between p-5 bg-white dark:bg-gray-800 border rounded shadow-sm transition-transform hover:scale-105">
              <div className="mb-6">
                <div className="flex items-center justify-between pb-6 mb-6 border-b">
                  <div>
                    <p className="text-sm font-bold tracking-wider uppercase">Free</p>
                    <p className="text-4xl font-bold">€0<span className="text-sm font-normal">/mo</span></p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "10 video uploads per month",
                    "Basic video categorization",
                    "Standard support"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => handleSelectPlan('free')}
                className="w-full"
                variant="outline"
              >
                Get Started
              </Button>
            </div>

            {/* Basic Plan */}
            <div className="relative flex flex-col justify-between p-5 bg-white dark:bg-gray-800 border rounded shadow-sm transition-transform hover:scale-105">
              <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium tracking-wider text-white uppercase rounded-bl rounded-tr bg-primary">
                Popular
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between pb-6 mb-6 border-b">
                  <div>
                    <p className="text-sm font-bold tracking-wider uppercase">Basic</p>
                    <p className="text-4xl font-bold">€7.99<span className="text-sm font-normal">/mo</span></p>
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
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => handleSelectPlan('basic')}
                className="w-full"
              >
                Start Free Trial
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="flex flex-col justify-between p-5 bg-white dark:bg-gray-800 border rounded shadow-sm transition-transform hover:scale-105">
              <div className="mb-6">
                <div className="flex items-center justify-between pb-6 mb-6 border-b">
                  <div>
                    <p className="text-sm font-bold tracking-wider uppercase">Premium</p>
                    <p className="text-4xl font-bold">€9.99<span className="text-sm font-normal">/mo</span></p>
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
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => handleSelectPlan('premium')}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
          <p className="mt-8 text-xs text-center text-gray-600 dark:text-gray-400">
            All paid plans include a 30-day free trial. No credit card required until trial ends.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingDialog;