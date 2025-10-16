import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Table, { type Column } from "../components/Table";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import LoansSkeleton from "../components/LoansSkeleton";
import { Plus, Edit2, Eye, Search, Filter, Trash2 } from "lucide-react";
import {
  useCreateLoan,
  useLoans,
  useUpdateLoan,
  useDeleteLoan,
  type LoanResponse,
} from "../hooks/useLoan";
import { useCustomers } from "../hooks/useCustomer";

type Loan = {
  id: string;
  customer: string;
  principal: number;
  interest: number;
  total: number;
  date: string;
  status: "Active" | "Pending" | "Completed";
};

const Loans: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "All" | "Active" | "Pending" | "Completed"
  >("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"issue" | "edit">("issue");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);
  const [page, setPage] = useState(0);
  const size = 10;
  
  const { data: paginated, isLoading: loansLoading } = useLoans(page, size);
  const { data: customersData } = useCustomers(0, 1000);

  const loans = React.useMemo(() => {
    if (!paginated || !paginated.content) return [];

    return paginated.content.map((loan: LoanResponse) => ({
      id: `L${loan.id}`,
      customer: loan.customerName,
      principal: loan.principal,
      interest: loan.principal * (loan.interestRate / 100),
      total: loan.totalAmountPayable,
      date: new Date(loan.dateIssued).toLocaleDateString(),
      status:
        loan.status === "ACTIVE"
          ? "Active"
          : loan.status === "PENDING"
          ? "Pending"
          : loan.status === "COMPLETED"
          ? "Completed"
          : ("Pending" as Loan["status"]),
    }));
  }, [paginated]);
  const [loanForm, setLoanForm] = useState({
    customerId: "",
    principal: 0,
    interestRate: 5,
    timePeriodYears: 1,
    dateIssued: "",
  });
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const filtered = loans.filter(
    (loan) =>
      (status === "All" || loan.status === status) &&
      (loan.id.toLowerCase().includes(search.toLowerCase()) ||
        loan.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenModal = (type: "issue" | "edit", loan?: Loan) => {
    setModalType(type);
    setSelectedLoan(loan || null);
    if (type === "edit" && loan) {
      const originalLoan = paginated?.content.find(l => `L${l.id}` === loan.id);
      setLoanForm({
        customerId: originalLoan?.customerId.toString() || "",
        principal: loan.principal,
        interestRate: 5,
        timePeriodYears: 1,
        dateIssued: new Date(originalLoan?.dateIssued || new Date()).toISOString().split('T')[0],
      });
    } else {
      setLoanForm({
        customerId: "",
        principal: 0,
        interestRate: 5,
        timePeriodYears: 1,
        dateIssued: new Date().toISOString().split('T')[0],
      });
    }
    setTouched({});
    setFormError("");
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const validate = () => {
    if (
      !loanForm.customerId ||
      !loanForm.principal ||
      !loanForm.interestRate ||
      !loanForm.timePeriodYears ||
      !loanForm.dateIssued.trim()
    ) {
      setFormError("All fields are required.");
      return false;
    }
    setFormError("");
    return true;
  };

  const createLoan = useCreateLoan();
  const updateLoan = useUpdateLoan();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (modalType === "issue") {
        await createLoan.mutateAsync({
          customerId: Number(loanForm.customerId),
          principal: loanForm.principal,
          interestRate: loanForm.interestRate,
          timePeriodYears: loanForm.timePeriodYears,
          dateIssued: loanForm.dateIssued,
        });
      } else if (modalType === "edit" && selectedLoan) {
        await updateLoan.mutateAsync({
          id: Number(selectedLoan.id.replace("L", "")),
          form: {
            customerId: Number(loanForm.customerId),
            principal: loanForm.principal,
            interestRate: loanForm.interestRate,
            timePeriodYears: loanForm.timePeriodYears,
            dateIssued: loanForm.dateIssued,
          },
        });
      }
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      setModalOpen(false);
    } catch (error) {
      console.error("Error submitting loan:", error);
      return;
    }
  };

  const deleteLoan = useDeleteLoan();

  const handleDeleteClick = (loan: Loan) => {
    setLoanToDelete(loan);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!loanToDelete) return;
    
    try {
      await deleteLoan.mutateAsync(Number(loanToDelete.id.replace("L", "")));
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      setDeleteModalOpen(false);
      setLoanToDelete(null);
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setLoanToDelete(null);
  };

  const columns: Column<Loan>[] = [
    { key: "id", label: "Loan ID" },
    { key: "customer", label: "Customer" },
    {
      key: "principal",
      label: "Principal",
      render: (v) => `₵${v.toLocaleString()}`,
    },
    {
      key: "interest",
      label: "Interest (5%)",
      render: (v) => `₵${v.toLocaleString()}`,
    },
    {
      key: "total",
      label: "Total Payable",
      render: (v) => (
        <span className="font-bold text-slate-900">₵{v.toLocaleString()}</span>
      ),
    },
    { key: "date", label: "Date Issued" },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_val, row) => (
        <div className="flex gap-2 justify-center">
          <Link to={`/loans/${row.id.replace(/^L/, "")}`} className="inline-flex">
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
              aria-label="View"
              title="View loan details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-200"
            aria-label="Edit"
            title="Edit loan"
            onClick={() => handleOpenModal("edit", row)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
            aria-label="Delete"
            title="Delete loan"
            onClick={() => handleDeleteClick(row)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loansLoading) {
    return <LoansSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Loans</h2>
          <p className="text-slate-600 mt-1">View and manage all loans</p>
        </div>
        <Button leftIcon={<Plus />} onClick={() => handleOpenModal("issue")}>
          Issue Loan
        </Button>
      </div>
      <Card>
        <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="w-5 h-5 text-slate-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search loans by ID, customer..."
            />
          </div>
          <select
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px]"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <Button variant="secondary" leftIcon={<Filter />}>
            Filters
          </Button>
        </div>
        <Table columns={columns} data={filtered} />

        {paginated && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={paginated?.totalPages || 1}
              totalElements={paginated?.totalElements || 0}
              pageSize={size}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalType === "issue" ? "Issue New Loan" : "Edit Loan"}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer*
            </label>
            <select
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={loanForm.customerId}
              onChange={(e) => {
                setLoanForm((f) => ({ ...f, customerId: e.target.value }));
                setTouched((t) => ({ ...t, customerId: true }));
              }}
            >
              <option value="">Select a customer</option>
              {customersData?.content.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phoneNumber}
                </option>
              ))}
            </select>
            {touched.customerId && !loanForm.customerId && (
              <div className="text-red-600 text-sm mt-1">Required</div>
            )}
          </div>

          <Input
            label="Principal Amount*"
            type="number"
            value={loanForm.principal || ""}
            onChange={(e) => {
              setLoanForm((f) => ({ ...f, principal: Number(e.target.value) }));
              setTouched((t) => ({ ...t, principal: true }));
            }}
            error={touched.principal && !loanForm.principal ? "Required" : ""}
          />

          <Input
            label="Interest Rate (%)*"
            type="number"
            step="0.1"
            value={loanForm.interestRate || ""}
            onChange={(e) => {
              setLoanForm((f) => ({
                ...f,
                interestRate: Number(e.target.value),
              }));
              setTouched((t) => ({ ...t, interestRate: true }));
            }}
            error={
              touched.interestRate && !loanForm.interestRate ? "Required" : ""
            }
          />

          <Input
            label="Time Period (Years)*"
            type="number"
            value={loanForm.timePeriodYears || ""}
            onChange={(e) => {
              setLoanForm((f) => ({
                ...f,
                timePeriodYears: Number(e.target.value),
              }));
              setTouched((t) => ({ ...t, timePeriodYears: true }));
            }}
            error={
              touched.timePeriodYears && !loanForm.timePeriodYears
                ? "Required"
                : ""
            }
          />

          <Input
            label="Date Issued*"
            type="date"
            value={loanForm.dateIssued}
            onChange={(e) => {
              setLoanForm((f) => ({ ...f, dateIssued: e.target.value }));
              setTouched((t) => ({ ...t, dateIssued: true }));
            }}
            error={touched.dateIssued && !loanForm.dateIssued ? "Required" : ""}
          />

          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !loanForm.customerId ||
                !loanForm.principal ||
                !loanForm.interestRate ||
                !loanForm.timePeriodYears ||
                !loanForm.dateIssued.trim()
              }
            >
              Submit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete Loan"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete this loan? This action cannot be
            undone.
          </p>
          {loanToDelete && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p>
                <strong>Loan ID:</strong> {loanToDelete.id}
              </p>
              <p>
                <strong>Customer:</strong> {loanToDelete.customer}
              </p>
              <p>
                <strong>Amount:</strong> ₵
                {loanToDelete.principal.toLocaleString()}
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={handleDeleteCancel}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleteLoan.isPending}
            >
              {deleteLoan.isPending ? "Deleting..." : "Delete Loan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Loans;
