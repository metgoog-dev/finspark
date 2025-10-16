import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import CustomerDetailSkeleton from '../components/CustomerDetailSkeleton';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Heart
} from 'lucide-react';
import { useCustomerDetail } from '../hooks/useCustomer';

interface LoanData {
  id: number;
  customerId: number;
  customerName: string;
  principal: number;
  interestRate: number;
  timePeriodYears: number;
  dateIssued: string;
  totalAmountPayable: number;
  status: string;
  createdAt: string;
}

const CustomerDetail: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, isError, error } = useCustomerDetail(customerId);

  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <Button variant="secondary" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 font-medium">Error loading customer details</div>
          <div className="text-red-500 text-sm mt-1">
            {(error as unknown as { message?: string })?.message || 'Customer not found'}
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-8">
        <Button variant="secondary" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="text-orange-600 font-medium">Customer not found</div>
          <div className="text-orange-500 text-sm mt-1">The requested customer could not be found.</div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₵${amount.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          bgColor: 'bg-green-50'
        };
      case 'PENDING':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          bgColor: 'bg-orange-50'
        };
      case 'COMPLETED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          bgColor: 'bg-blue-50'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const activeLoans = customer.loanHistory?.filter((loan: LoanData) => loan.status === 'ACTIVE').length || 0;

  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Customers
        </Button>
        <div className="h-6 w-px bg-slate-300" />
        <h1 className="text-2xl font-bold text-slate-900">Customer Details</h1>
      </div>

      {/* Customer Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white p-6 text-slate-900">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-4xl font-bold border-4 border-white shadow-sm">
              {customer.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{customer.name}</h2>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-700">ID Card:</span>
                  <span className="text-slate-900 font-semibold">{customer.idCard}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-700">Phone:</span>
                  <span className="text-slate-900 font-semibold">{customer.phoneNumber}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-500 text-sm">Customer Since</div>
              <div className="text-lg font-semibold text-slate-900">{formatDate(customer.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Marital Status</div>
                <div className="font-semibold text-slate-900">{customer.maritalStatus}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Employment</div>
                <div className="font-semibold text-slate-900">{customer.employmentStatus}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Employer</div>
                <div className="font-semibold text-slate-900">{customer.employerName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Date of Birth</div>
                <div className="font-semibold text-slate-900">{formatDate(customer.dateOfBirth)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Address</div>
                <div className="font-semibold text-slate-900">{customer.address}</div>
              </div>
            </div>
          </div>

          {/* Loan Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-blue-600 text-sm font-medium">Total Loans</div>
                  <div className="text-2xl font-bold text-blue-900">{customer.totalLoans}</div>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-green-600 text-sm font-medium">Total Borrowed</div>
                  <div className="text-2xl font-bold text-green-900">{formatCurrency(customer.totalBorrowed)}</div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-purple-600 text-sm font-medium">Active Loans</div>
                  <div className="text-2xl font-bold text-purple-900">{activeLoans}</div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Loan History */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Loan History</h3>
          <div className="text-sm text-slate-500">
            {customer.loanHistory?.length || 0} loan{customer.loanHistory?.length !== 1 ? 's' : ''}
          </div>
        </div>

        {customer.loanHistory && customer.loanHistory.length > 0 ? (
          <div className="space-y-4">
            {customer.loanHistory.map((loan: LoanData) => {
              const statusInfo = getStatusInfo(loan.status);
              return (
                <div key={loan.id} className={`border rounded-lg p-6 ${statusInfo.bgColor} border-slate-200 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <DollarSign className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">Loan #{loan.id}</h4>
                        <div className="text-sm text-slate-500">Issued on {formatDate(loan.dateIssued)}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {loan.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-slate-500 text-sm mb-1">Principal Amount</div>
                      <div className="font-bold text-slate-900">{formatCurrency(loan.principal)}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-slate-500 text-sm mb-1">Interest Rate</div>
                      <div className="font-bold text-slate-900">{loan.interestRate}%</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-slate-500 text-sm mb-1">Duration</div>
                      <div className="font-bold text-slate-900">{loan.timePeriodYears} year{loan.timePeriodYears !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-slate-500 text-sm mb-1">Total Payable</div>
                      <div className="font-bold text-slate-900">{formatCurrency(loan.totalAmountPayable)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Loan History</h3>
            <p className="text-slate-500">This customer hasn't taken any loans yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerDetail;
