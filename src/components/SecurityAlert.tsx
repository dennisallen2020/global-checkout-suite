
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, X } from 'lucide-react';

interface SecurityAlertProps {
  message: string;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({ message }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="shadow-lg border-red-500 bg-red-50">
        <Shield className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{message}</span>
          <X className="h-4 w-4 ml-2" />
        </AlertDescription>
      </Alert>
    </div>
  );
};
