
import { Check, X } from "lucide-react";
import React from "react";

interface PasswordRequirementProps {
  met: boolean;
  label: string;
}

const PasswordRequirement = ({ met, label }: PasswordRequirementProps) => (
  <div className={`flex items-center gap-1 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
    {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
    <span>{label}</span>
  </div>
);

export default PasswordRequirement;
