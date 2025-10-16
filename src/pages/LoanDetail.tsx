import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { Edit2, Trash2 } from 'lucide-react';
import { useLoanDetail, useUpdateLoan, useDeleteLoan } from '../hooks/useLoan';
import { Spinner } from '../components/Spinner';

const LoanDetail: React.FC = () => {
  const { loanId } = useParams<{loanId: string}>();
  const navigate = useNavigate();
  const numericLoanId = loanId && loanId.startsWith('L') ? loanId.substring(1) : loanId;
  const { data: loan, isLoading, error, refetch } = useLoanDetail(numericLoanId);
  const updateLoan = useUpdateLoan();
  const deleteLoan = useDeleteLoan();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    principal: 0,
    status: ''
  });
  
  useEffect(() => {
    if (loan) {
      setFormData({
        principal: loan.principal,
        status: loan.status
      });
    }
  }, [loan]);
  
  const handleEditLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!loan) return;
      
      await updateLoan.mutateAsync({
        id: loan.id,
        form: {
          customerId: loan.customerId,
          principal: formData.principal,
          interestRate: loan.interestRate,
          timePeriodYears: loan.timePeriodYears,
          dateIssued: loan.dateIssued
        }
      });
      
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating loan:', error);
    }
  };
  
  const handleDeleteLoan = async () => {
    if (!loan) return;
    
    if (window.confirm('Are you sure you want to delete this loan? This action cannot be undone.')) {
      try {
        await deleteLoan.mutateAsync(loan.id);
        navigate('/loans');
      } catch (error) {
        console.error('Error deleting loan:', error);
      }
    }
  };
  
  if (isLoading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>;
  if (error || !loan) return <div className="p-8 text-red-500 font-semibold">Error loading loan details</div>;
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Loan #{loan.id}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ml-2 shadow-sm
              ${loan.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' :
                loan.status === 'PENDING' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                loan.status === 'PAID' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                'bg-slate-100 text-slate-700 border border-slate-200'}`}>{loan.status.charAt(0) + loan.status.slice(1).toLowerCase()}</span>
          </div>
          <div className="mt-1 text-base text-slate-600">Customer: <span className="font-medium text-slate-800">{loan.customerName}</span></div>
          <div className="text-sm text-slate-500 mt-1">Issued:
            <span className="ml-1 font-medium text-slate-700">{new Date(loan.dateIssued).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="py-2 px-6 text-sm font-semibold shadow-md" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit Loan
          </Button>
          <Button variant="danger" className="py-2 px-6 text-sm font-semibold text-red-600 shadow-md hover:bg-red-50" onClick={handleDeleteLoan}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
      {/* Loan Details Card */}
      <Card className="p-0 overflow-hidden shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-x sm:divide-y-0 divide-slate-200">
          <div className="p-6 flex flex-col items-center">
            <div className="text-sm font-medium text-slate-500">Principal</div>
            <div className="font-extrabold text-lg sm:text-xl text-slate-900 mt-2">₵{formatCurrency(loan.principal)}</div>
          </div>
          <div className="p-6 flex flex-col items-center">
            <div className="text-sm font-medium text-slate-500">Interest Rate</div>
            <div className="font-extrabold text-lg sm:text-xl text-slate-900 mt-2">{loan.interestRate}%</div>
          </div>
          <div className="p-6 flex flex-col items-center">
            <div className="text-sm font-medium text-slate-500">Total Payable</div>
            <div className="font-extrabold text-lg sm:text-xl text-blue-800 mt-2">₵{formatCurrency(loan.totalAmountPayable)}</div>
          </div>
        </div>
      </Card>
      {/* Edit Loan Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Loan">
        <form onSubmit={handleEditLoan} className="space-y-4 pt-2">
          <Input
            label="Principal Amount"
            type="number"
            value={formData.principal}
            onChange={(e) => setFormData({...formData, principal: parseFloat(e.target.value)})}
            required
          />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} className="px-5">Cancel</Button>
            <Button type="submit" disabled={updateLoan.isPending} className="px-6">
              {updateLoan.isPending ? 'Updating...' : 'Update Loan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default LoanDetail;
