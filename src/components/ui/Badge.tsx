import React from 'react';
import { cn } from '@/src/lib/utils';

export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  outline?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  error: 'bg-error/10 text-error border-error/20',
  neutral: 'bg-neutral-100 text-neutral-500 border-neutral-200',
  success: 'bg-green-500/10 text-green-600 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

export const Badge = ({ 
  children, 
  variant = 'neutral', 
  className,
  outline = true 
}: BadgeProps) => {
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center justify-center",
      variantStyles[variant],
      outline ? "border" : "border-none",
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
