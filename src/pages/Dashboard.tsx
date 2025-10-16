import React from 'react';
import Card from '../components/Card';
import type { Column } from '../components/Table';
import Table from '../components/Table';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useDashboardStats, type LoanResponse, type TopCustomer } from '../hooks/useDashboard';

const columns: Column<LoanResponse>[] = [
  { key: 'id', label: 'Loan ID' },
  { key: 'customerName', label: 'Customer' },
  { key: 'principal', label: 'Amount' },
  { key: 'dateIssued', label: 'Date Issued' },
  { key: 'status', label: 'Status', render: (status) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'ACTIVE' ? 'bg-green-100 text-green-800' : status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'}`}>{status}</span>
  ) },
];

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, isError, error } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 font-medium">Error loading dashboard</div>
          <div className="text-red-500 text-sm mt-1">
            {(error as unknown as { message?: string })?.message || 'An unexpected error occurred'}
          </div>
        </div>
      </div>
    );
  }

  const statBlocks = [
    {
      label: "Total Customers",
      value: stats?.totalCustomers?.toLocaleString() ?? "--",
      icon: <Users className="w-7 h-7" />,
      color: "bg-blue-500",
    },
    {
      label: "Active Loans",
      value: stats?.activeLoans?.toLocaleString() ?? "--",
      icon: <DollarSign className="w-7 h-7" />,
      color: "bg-green-500",
    },
    {
      label: "Total Disbursed",
      value: stats?.totalDisbursed.toLocaleString()
        ? `₵ ${Number(stats.totalDisbursed).toLocaleString()}`
        : "--",
      icon: <TrendingUp className="w-7 h-7" />,
      color: "bg-purple-500",
    },
    {
      label: "Pending Applications",
      value: stats?.pendingLoans?.toLocaleString() ?? "--",
      icon: <Clock className="w-7 h-7" />,
      color: "bg-orange-500",
    },
  ];

  const chartData = stats?.chartData || [];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h2>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statBlocks.map(stat => (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className={`rounded-lg w-14 h-14 flex items-center justify-center text-white ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header="Loan Activity (Last 7 days)">
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 8, left: 4, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card header="Top Customers">
          <div className="space-y-3">
            {stats?.topCustomers && stats.topCustomers.length > 0 ? (
              stats.topCustomers.map((customer: TopCustomer) => (
                <div key={customer.customerId} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-semibold text-lg">
                    {customer.customerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-slate-900">{customer.customerName}</div>
                    <div className="text-xs text-slate-500">{customer.totalLoans} Loans</div>
                  </div>
                  <div className="text-xl font-bold text-slate-900">₵{Number(customer.totalBorrowed).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm">No customer data available.</div>
            )}
          </div>
        </Card>
      </div>
      {/* Recent Loans Table */}
      <Card header={<span>Recent Loans</span>}>
        <Table columns={columns} data={stats?.recentLoans ?? []} />
      </Card>
    </div>
  );
};

export default Dashboard;
