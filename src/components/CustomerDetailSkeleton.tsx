import React from 'react';
import { Skeleton, SkeletonCard } from './Skeleton';

const CustomerDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Back button skeleton */}
      <div className="h-10 w-20 bg-slate-200 rounded animate-pulse" />
      
      {/* Customer header skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex gap-6 items-center mb-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        
        {/* Customer info grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
        
        {/* Loan summary skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
      
      {/* Loan history skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailSkeleton;
