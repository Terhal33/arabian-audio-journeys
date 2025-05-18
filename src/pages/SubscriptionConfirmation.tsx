
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';

const SubscriptionConfirmationPage = () => {
  const navigate = useNavigate();
  
  // In a real app, we would fetch this data from the backend
  // For now, we'll use mock data from session storage
  const planId = sessionStorage.getItem('selectedPlan') || 'premium';
  const billingPeriod = sessionStorage.getItem('billingPeriod') || 'monthly';
  
  const planPrice = planId === 'premium' 
    ? (billingPeriod === 'monthly' ? 9.99 : 99.99)
    : (billingPeriod === 'monthly' ? 14.99 : 149.99);
  
  // Mock dates
  const today = new Date();
  const trialEndDate = new Date(today);
  trialEndDate.setDate(today.getDate() + 7);
  
  const nextBillingDate = new Date(trialEndDate);
  if (billingPeriod === 'monthly') {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  } else {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-light">
      <Navbar />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2 text-desert-dark">
            Subscription Confirmed!
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Your {planId} subscription has been successfully set up. Enjoy your 7-day free trial!
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-medium text-xl mb-4">Subscription Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium capitalize">{planId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing cycle</span>
                <span className="capitalize">{billingPeriod}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>{formatPrice(planPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free trial ends</span>
                <span>{formatDate(trialEndDate)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next billing date</span>
                <span>{formatDate(nextBillingDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Your premium access is now active!</h3>
            <p className="text-muted-foreground mb-4">
              You now have full access to all premium features and content.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/tours')}>
                Explore Tours
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/library')}>
                <Download className="mr-2 h-4 w-4" /> My Library
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between flex-wrap gap-4">
          <Button variant="outline" onClick={() => navigate('/receipt')}>
            View Receipt
          </Button>
          <Button onClick={() => navigate('/home')}>
            Continue to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfirmationPage;
