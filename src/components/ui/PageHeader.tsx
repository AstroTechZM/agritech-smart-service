import React from 'react';
import { cn } from '@/src/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  category,
  actions,
  className
}: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-end gap-4", className)}>
      <div>
        {category && (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            {category}
          </span>
        )}
        <h2 className="text-3xl font-black font-headline tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-neutral-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex gap-3 w-full md:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
