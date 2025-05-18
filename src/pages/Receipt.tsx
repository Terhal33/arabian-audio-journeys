
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/auth/AuthProvider';

const ReceiptPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // In a real app, we would fetch this data from the backend
  // For now, we'll use mock data
  const receiptData = {
    receiptNumber: 'INV-2025-001',
    date: new Date(),
    planId: sessionStorage.getItem('selectedPlan') || 'premium',
    billingPeriod: sessionStorage.getItem('billingPeriod') || 'monthly',
    paymentMethod: 'Visa ending in 4242',
    userEmail: user?.email || 'customer@example.com',
  };
  
  const planPrice = receiptData.planId === 'premium' 
    ? (receiptData.billingPeriod === 'monthly' ? 9.99 : 99.99)
    : (receiptData.billingPeriod === 'monthly' ? 14.99 : 149.99);
  
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
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // In a real app, this would generate a PDF receipt
    // For now, we'll just show an alert
    alert('Receipt PDF download would start in a real app');
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-light">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="print:hidden mb-6 flex justify-between items-center">
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
        </div>
        
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-6 print:p-0">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="font-display text-2xl font-bold mb-1 text-desert-dark">
                  Receipt
                </h1>
                <p className="text-muted-foreground">
                  {receiptData.receiptNumber}
                </p>
              </div>
              
              <div className="text-right">
                <h2 className="font-bold text-xl">Arabian Audio Journeys</h2>
                <p className="text-sm text-muted-foreground">
                  info@arabianaudiojourneys.com<br />
                  Riyadh, Saudi Arabia
                </p>
              </div>
            </div>
            
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Billed To</h3>
                <p>{receiptData.userEmail}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Date</h3>
                <p>{formatDate(receiptData.date)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Payment Method</h3>
                <p>{receiptData.paymentMethod}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Status</h3>
                <p className="text-green-600">Paid</p>
              </div>
            </div>
            
            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-1 text-left">Description</th>
                    <th className="py-2 px-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 px-1">
                      <div>
                        <p className="font-medium capitalize">{receiptData.planId} Plan</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {receiptData.billingPeriod} subscription (includes 7-day free trial)
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-1 text-right">
                      {formatPrice(planPrice)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <th className="py-4 px-1 text-left">Total</th>
                    <th className="py-4 px-1 text-right">{formatPrice(planPrice)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <Separator className="my-8" />
            
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Thank you for your subscription!</p>
              <p>If you have any questions about this receipt, please contact us at support@arabianaudiojourneys.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptPage;
