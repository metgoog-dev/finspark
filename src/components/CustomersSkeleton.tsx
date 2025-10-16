import React from 'react';
import { SkeletonTable } from './Skeleton';

const CustomersSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-48 bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-slate-200 rounded animate-pulse" />
      </div>
      
      {/* Search and filter skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-slate-200 rounded animate-pulse" />
        </div>
        
        {/* Table skeleton */}
        <SkeletonTable rows={8} cols={6} />
      </div>
    </div>
  );
};

export default CustomersSkeleton;
