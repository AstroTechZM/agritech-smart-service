import React from 'react';
import { cn } from '@/src/lib/utils';
import Skeleton from 'react-loading-skeleton';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  skeletonWidth?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  className?: string;
}

export const DataTable = <T,>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "No records found.",
  rowKey,
  onRowClick,
  className
}: DataTableProps<T>) => {
  return (
    <div className={cn("bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/30">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "px-8 py-4 text-[10px] font-bold uppercase text-neutral-400 tracking-widest whitespace-nowrap",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr key={`skel-row-${rowIndex}`}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-8 py-5">
                      <Skeleton width={col.skeletonWidth || "6rem"} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr 
                  key={rowKey(row)} 
                  className={cn(
                    "hover:bg-primary/5 transition-colors group cursor-default",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={cn("px-8 py-5 text-sm", col.className)}>
                      {typeof col.accessor === 'function' 
                        ? col.accessor(row) 
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-8 py-12 text-center text-neutral-400 font-bold text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
