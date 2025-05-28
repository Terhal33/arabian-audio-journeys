
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log specific error types for better debugging
    if (error.message.includes('Maximum update depth exceeded')) {
      console.error('Infinite loop detected in component rendering');
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isInfiniteLoop = this.state.error?.message.includes('Maximum update depth exceeded');

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-sand-light">
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isInfiniteLoop 
                  ? "A component is stuck in an infinite loop. Please reload the page to continue."
                  : "Something went wrong. Please try refreshing the page or contact support if the problem persists."
                }
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={this.handleReset} 
                className="w-full"
                variant="outline"
                disabled={isInfiniteLoop}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isInfiniteLoop ? 'Reset Disabled' : 'Try Again'}
              </Button>
              
              <Button 
                onClick={this.handleReload} 
                className="w-full"
              >
                Reload Page
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-2 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
