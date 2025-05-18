
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  RefreshCw, 
  FileText, 
  X, 
  AlertCircle,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/AuthProvider';
import Navbar from '@/components/Navbar';

const SubscriptionManagementPage = () => {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, this data would come from the backend
  // Mock subscription data
  const subscriptionData = {
    planName: 'Premium',
    status: 'active',
    trialEnds: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Same as trial end
    billingPeriod: 'monthly',
    amount: 9.99,
    paymentMethod: {
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025
    },
    invoices: [
      { id: 'INV-001', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), amount: 9.99, status: 'paid' }
    ]
  };
  
  const isTrialActive = new Date() < subscriptionData.trialEnds;
  
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
  
  const handleCancelSubscription = () => {
    setIsLoading(true);
    
    // In a real app, this would call an API to cancel the subscription
    setTimeout(() => {
      setIsLoading(false);
      setCancelDialogOpen(false);
      
      toast({
        title: "Subscription canceled",
        description: "Your subscription has been canceled. You'll have access until the end of the current billing period.",
      });
      
      // In a real app, this would update the subscription status in the UI
    }, 1500);
  };
  
  const handleUpdatePaymentMethod = () => {
    // In a real app, this would navigate to a payment method update page or open a modal
    toast({
      title: "Not implemented",
      description: "In a real app, this would open a payment method update UI",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-sand-light">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
        </Button>
        
        <h1 className="font-display text-2xl font-bold mb-6 text-desert-dark">
          Subscription Management
        </h1>
        
        {!isPremium ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <h2 className="text-xl font-medium mb-2">You don't have an active subscription</h2>
                <p className="text-muted-foreground mb-6">
                  Upgrade to a premium plan to access all features and content
                </p>
                <Button onClick={() => navigate('/subscription')}>View Subscription Plans</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Manage your subscription plan and billing</CardDescription>
                  </div>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-2">Plan Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium">{subscriptionData.planName}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing</span>
                        <span className="capitalize">{subscriptionData.billingPeriod}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span>
                          {formatPrice(subscriptionData.amount)}/
                          {subscriptionData.billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      
                      {isTrialActive && (
                        <div className="flex justify-between text-blue-600 font-medium">
                          <span>Trial ends</span>
                          <span>{formatDate(subscriptionData.trialEnds)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next billing date</span>
                        <span>{formatDate(subscriptionData.nextBillingDate)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/subscription')}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Change Plan
                      </Button>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelDialogOpen(true)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-2">Payment Method</h3>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-14 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-medium">
                            {subscriptionData.paymentMethod.brand === 'visa' ? 'VISA' : 'CARD'}
                          </div>
                          
                          <div>
                            <p className="font-medium">•••• {subscriptionData.paymentMethod.last4}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires {subscriptionData.paymentMethod.expiryMonth}/
                              {subscriptionData.paymentMethod.expiryYear}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={handleUpdatePaymentMethod}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Update Payment Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <h2 className="font-medium text-xl mb-4">Billing History</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Invoice ID</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionData.invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                          <td className="py-3 px-4">{invoice.id}</td>
                          <td className="py-3 px-4">{formatPrice(invoice.amount)}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600">
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/receipt')}>
                              <FileText className="h-4 w-4 mr-1" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Your benefits will end on {formatDate(subscriptionData.nextBillingDate)}</p>
                <p className="text-sm text-muted-foreground">
                  You will still have access to premium features until the end of your current billing period.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">You won't be charged again</p>
                <p className="text-sm text-muted-foreground">
                  Your payment method won't be charged for future billing periods.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <p className="text-sm text-muted-foreground">
              You can resubscribe at any time to restore full premium access.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isLoading}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isLoading}
            >
              {isLoading ? "Canceling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagementPage;
