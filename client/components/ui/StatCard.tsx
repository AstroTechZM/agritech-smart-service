import React from 'react';
import { cn } from '@/lib/utils';
import Skeleton from 'react-loading-skeleton';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value?: string | number;
  trend?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
  urgent?: boolean;
  className?: string;
  variant?: 'default' | 'primary';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon: Icon,
  isLoading = false,
  urgent = false,
  className,
  variant = 'default'
}) => {
  if (isLoading) {
    return (
      <div className={cn("bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm", className)}>
        <div className="flex justify-between items-start mb-4">
          <Skeleton circle width="3rem" height="3rem" />
          <Skeleton width="4rem" height="1.5rem" borderRadius="1rem" />
        </div>
        <Skeleton width="6rem" height="1rem" className="mb-2 block" />
        <Skeleton width="10rem" height="2rem" />
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm transition-all hover:shadow-md",
      variant === 'primary' && "bg-primary-container text-white",
      urgent && "bg-error-container/20 border-error/20",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className={cn(
            "p-3 rounded-2xl",
            variant === 'primary' ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
          )}>
            <Icon size={24} />
          </div>
        )}
        {trend && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full",
            variant === 'primary' ? "bg-white/10 text-white" : "bg-primary/5 text-primary"
          )}>
            {trend}
          </span>
        )}
      </div>
      <p className={cn(
        "text-[10px] font-bold uppercase",
        variant === 'primary' ? "text-white/80" : "text-neutral-500"
      )}>
        {label}
      </p>
      <h3 className={cn(
        "text-3xl font-black font-headline mt-1",
        urgent && "text-error"
      )}>
        {value}
      </h3>
    </div>
  );
};

export default StatCard;

