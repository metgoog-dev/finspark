import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', children, style }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} style={style}>
    {children}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 ${className}`}>
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const SkeletonStatCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center gap-4">
    <Skeleton className="w-14 h-14 rounded-lg" />
    <div className="flex-1">
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {/* Table header */}
    <div className="flex gap-4 pb-3 border-b border-slate-200">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Table rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-3">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-48" />
    <div className="h-60 flex items-end justify-between gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="w-8 rounded-t" 
          style={{ height: `${Math.random() * 200 + 50}px` }}
        />
      ))}
    </div>
    <div className="flex justify-between">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-6" />
      ))}
    </div>
  </div>
);

export const SkeletonTopCustomers: React.FC = () => (
  <div className="space-y-3">
    <Skeleton className="h-6 w-32 mb-4" />
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);

export default Skeleton;
