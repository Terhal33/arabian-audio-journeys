
import React from "react";
import { Progress } from "@/components/ui/progress";
import PasswordRequirement from "./PasswordRequirement";

interface PasswordStrengthProps {
  password: string;
  language: 'en' | 'ar';
  passwordStrength: number;
}

const PasswordStrength = ({ password, language, passwordStrength }: PasswordStrengthProps) => {
  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return language === 'ar' ? 'ضعيف' : 'Weak';
    if (passwordStrength < 60) return language === 'ar' ? 'متوسط' : 'Medium';
    return language === 'ar' ? 'قوي' : 'Strong';
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs">{getStrengthText()}</span>
        <span className="text-xs">{passwordStrength}%</span>
      </div>
      <Progress 
        value={passwordStrength} 
        className={`h-1.5 ${getStrengthColor()}`}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        <PasswordRequirement
          met={password.length >= 8}
          label={language === 'ar' ? '8 أحرف على الأقل' : 'At least 8 characters'}
        />
        <PasswordRequirement
          met={/[A-Z]/.test(password)}
          label={language === 'ar' ? 'حرف كبير' : 'Uppercase letter'}
        />
        <PasswordRequirement
          met={/[0-9]/.test(password)}
          label={language === 'ar' ? 'رقم' : 'Number'}
        />
        <PasswordRequirement
          met={/[^a-zA-Z0-9]/.test(password)}
          label={language === 'ar' ? 'حرف خاص' : 'Special character'}
        />
      </div>
    </div>
  );
};

export default PasswordStrength;
