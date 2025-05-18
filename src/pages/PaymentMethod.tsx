
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Ticket, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/AuthProvider';
import Navbar from '@/components/Navbar';

const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [promoCode, setPromoCode] = useState<string>('');
  const [isPromoValid, setIsPromoValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get selected plan from session storage
  const [planInfo, setPlanInfo] = useState({
    planId: '',
    billingPeriod: '',
    price: 0
  });

  useEffect(() => {
    const selectedPlan = sessionStorage.getItem('selectedPlan');
    const billingPeriod = sessionStorage.getItem('billingPeriod');
    
    if (!selectedPlan || !billingPeriod) {
      toast({
        variant: "destructive",
        title: "No plan selected",
        description: "Please select a subscription plan first"
      });
      navigate('/subscription');
      return;
    }
    
    // Get plan price based on selected plan and billing period
    // In a real app, this would be fetched from the database/API
    let price = 0;
    if (selectedPlan === 'premium') {
      price = billingPeriod === 'monthly' ? 9.99 : 99.99;
    } else if (selectedPlan === 'family') {
      price = billingPeriod === 'monthly' ? 14.99 : 149.99;
    }
    
    setPlanInfo({
      planId: selectedPlan,
      billingPeriod,
      price
    });
  }, [navigate]);

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast({
        variant: "destructive",
        title: "Enter promo code",
        description: "Please enter a promo code first"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate promo code verification
    setTimeout(() => {
      // Mock validation - in a real app, this would be an API call
      const isValid = promoCode.toLowerCase() === 'welcome10';
      
      setIsPromoValid(isValid);
      
      if (isValid) {
        toast({
          title: "Promo code applied!",
          description: "You received a 10% discount"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid promo code",
          description: "The promo code you entered is invalid or expired"
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleContinue = () => {
    // In a real app, this would process the payment or save payment details
    // For now, we'll just navigate to the confirmation page
    navigate('/subscription-confirmation');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const calculatedPrice = isPromoValid ? planInfo.price * 0.9 : planInfo.price;

  return (
    <div className="min-h-screen flex flex-col bg-sand-light">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/subscription')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
        </Button>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="font-display text-2xl font-bold mb-6">Payment Method</h1>
            
            <RadioGroup 
              defaultValue="card" 
              className="mb-8"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <div className="rounded-lg border p-4 mb-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit / Debit Card
                  </Label>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="mt-4 pl-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on card</Label>
                        <Input id="cardName" placeholder="John Smith" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card number</Label>
                        <Input id="cardNumber" placeholder="4242 4242 4242 4242" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry date</Label>
                          <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="rounded-lg border p-4 mb-3 cursor-not-allowed opacity-50">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apple-pay" id="apple-pay" disabled />
                  <Label htmlFor="apple-pay" className="flex items-center">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Apple Pay
                  </Label>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 mb-3 cursor-not-allowed opacity-50">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="google-pay" id="google-pay" disabled />
                  <Label htmlFor="google-pay" className="flex items-center">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Google Pay
                  </Label>
                </div>
              </div>
            </RadioGroup>
            
            <div className="mb-8">
              <h2 className="font-semibold mb-3">Have a promo code?</h2>
              <div className="flex gap-3">
                <Input 
                  placeholder="Enter promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="max-w-xs"
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyPromoCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Applying..." : "Apply"}
                </Button>
              </div>
              {isPromoValid === true && (
                <p className="mt-2 text-sm text-green-600">10% discount applied!</p>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleContinue} className="w-full md:w-auto">
                Continue to Confirmation
              </Button>
              <p className="text-xs text-muted-foreground text-center md:text-left">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">{planInfo.planId} Plan</span>
                    <span>{formatPrice(planInfo.price)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Billing</span>
                    <span className="capitalize">{planInfo.billingPeriod}</span>
                  </div>
                  
                  {isPromoValid && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo discount</span>
                      <span>-{formatPrice(planInfo.price * 0.1)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(calculatedPrice)}</span>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md flex gap-2">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Your subscription includes a 7-day free trial. You won't be charged until the trial ends.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
