import React from 'react';
import { Skeleton, SkeletonTable } from './Skeleton';

export const LoansSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Card skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
          <div className="flex-1">
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-12 w-20" />
        </div>

        {/* Table skeleton */}
        <SkeletonTable rows={8} cols={7} />

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansSkeleton;
