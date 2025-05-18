
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Crown, Users, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';

type SubscriptionPeriod = 'monthly' | 'yearly';

interface PlanFeature {
  name: string;
  includedIn: ('free' | 'premium' | 'family')[];
}

interface PlanPricing {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  popular?: boolean;
  color?: string;
  icon?: React.ReactNode;
}

const SubscriptionPage = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<SubscriptionPeriod>('monthly');

  const features: PlanFeature[] = [
    { name: 'Basic audio tours', includedIn: ['free', 'premium', 'family'] },
    { name: 'Ad-free experience', includedIn: ['premium', 'family'] },
    { name: 'Offline downloads', includedIn: ['premium', 'family'] },
    { name: 'Premium tours & content', includedIn: ['premium', 'family'] },
    { name: 'Exclusive cultural insights', includedIn: ['premium', 'family'] },
    { name: 'High quality audio', includedIn: ['premium', 'family'] },
    { name: 'Family sharing (up to 6 users)', includedIn: ['family'] },
    { name: 'Priority customer support', includedIn: ['premium', 'family'] },
  ];

  const plans: PlanPricing[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic access with limited features',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features,
      icon: <X className="h-5 w-5" />
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Full access to all premium content',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features,
      popular: true,
      color: 'bg-gold text-night',
      icon: <Crown className="h-5 w-5" />
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Share with up to 6 family members',
      monthlyPrice: 14.99,
      yearlyPrice: 149.99,
      features,
      icon: <Users className="h-5 w-5" />
    }
  ];

  const getPlanPrice = (plan: PlanPricing) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      toast({
        title: "You're already on the Free plan",
        description: "Enjoy your free access to basic tours."
      });
      return;
    }

    // Save selected plan to session storage for use in the payment flow
    sessionStorage.setItem('selectedPlan', planId);
    sessionStorage.setItem('billingPeriod', billingPeriod);
    
    navigate('/payment-method');
  };

  const getSavingsPercentage = (plan: PlanPricing) => {
    if (billingPeriod === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyCostForYear = plan.monthlyPrice * 12;
      const savings = ((monthlyCostForYear - plan.yearlyPrice) / monthlyCostForYear) * 100;
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-light">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2 text-desert-dark">Choose Your Plan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock premium audio tours and exclusive content with our subscription plans
          </p>
        </div>

        <Tabs 
          defaultValue="monthly" 
          className="w-full mb-8"
          onValueChange={(value) => setBillingPeriod(value as SubscriptionPeriod)}
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="monthly" className="text-center">
                Monthly Billing
              </TabsTrigger>
              <TabsTrigger value="yearly" className="text-center">
                Yearly Billing
                <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs text-black">
                  Save 16%+
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  billingPeriod={billingPeriod}
                  features={features}
                  onSelect={handleSelectPlan}
                  currentPlan={isPremium ? 'premium' : 'free'}
                  savingsPercentage={getSavingsPercentage(plan)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  billingPeriod={billingPeriod}
                  features={features}
                  onSelect={handleSelectPlan}
                  currentPlan={isPremium ? 'premium' : 'free'}
                  savingsPercentage={getSavingsPercentage(plan)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto text-left divide-y">
            <FAQItem 
              question="How does the free trial work?" 
              answer="All premium plans come with a 7-day free trial. You won't be charged until the trial period ends, and you can cancel anytime before that."
            />
            <FAQItem 
              question="Can I switch between plans?" 
              answer="Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, the change will take effect at the end of your current billing cycle."
            />
            <FAQItem 
              question="How does family sharing work?" 
              answer="With the Family plan, you can invite up to 5 additional family members to enjoy all premium features under a single subscription."
            />
            <FAQItem 
              question="Can I cancel my subscription?" 
              answer="Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

interface PlanCardProps {
  plan: PlanPricing;
  billingPeriod: SubscriptionPeriod;
  features: PlanFeature[];
  onSelect: (planId: string) => void;
  currentPlan: string;
  savingsPercentage: number;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  billingPeriod, 
  features, 
  onSelect,
  currentPlan,
  savingsPercentage
}) => {
  const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const isCurrentPlan = currentPlan === plan.id;
  const buttonText = plan.id === 'free' ? 'Current Plan' : isCurrentPlan ? 'Current Plan' : 'Select Plan';

  return (
    <Card className={`relative overflow-hidden transition-all ${plan.popular ? 'border-gold shadow-lg scale-105 md:scale-110' : 'hover:border-muted-foreground'}`}>
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-gold text-night px-3 py-1 text-xs font-medium">
          Most Popular
        </div>
      )}
      
      <CardHeader className={plan.popular ? 'bg-gold/10' : ''}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${plan.popular ? 'bg-gold text-night' : 'bg-muted'}`}>
            {plan.icon}
          </div>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
            {price > 0 && (
              <span className="text-muted-foreground mb-1">
                /{billingPeriod === 'monthly' ? 'month' : 'year'}
              </span>
            )}
          </div>
          
          {savingsPercentage > 0 && (
            <p className="text-sm text-green-600 font-medium mt-1">
              Save {savingsPercentage}% with annual billing
            </p>
          )}
          
          {price > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              7-day free trial included
            </p>
          )}
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature) => {
            const included = feature.includedIn.includes(plan.id as 'free' | 'premium' | 'family');
            return (
              <li key={feature.name} className="flex items-start">
                <div className={`mt-1 mr-2 ${included ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {included ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <span className={!included ? 'text-muted-foreground' : ''}>
                  {feature.name}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelect(plan.id)} 
          className="w-full" 
          variant={plan.popular ? 'default' : 'outline'}
          disabled={isCurrentPlan || (plan.id === 'free' && currentPlan === 'premium')}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const FAQItem: React.FC<{question: string; answer: string}> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="py-4">
      <button 
        className="flex justify-between items-center w-full text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <ChevronRight className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-2 text-muted-foreground">
          {answer}
        </p>
      )}
    </div>
  );
};

export default SubscriptionPage;
