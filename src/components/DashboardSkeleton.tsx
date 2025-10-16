import React from 'react';
import { SkeletonStatCard, SkeletonChart, SkeletonTopCustomers, SkeletonTable } from './Skeleton';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Page title skeleton */}
      <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      
      {/* Chart and Top Customers Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Card Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-6" />
          <SkeletonChart />
        </div>
        
        {/* Top Customers Card Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <SkeletonTopCustomers />
        </div>
      </div>
      
      {/* Recent Loans Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-6" />
        <SkeletonTable rows={5} cols={5} />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
