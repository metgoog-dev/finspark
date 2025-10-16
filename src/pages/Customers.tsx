import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Table, { type Column } from "../components/Table";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import CustomersSkeleton from "../components/CustomersSkeleton";
import { Plus, Filter, Search, Eye, Edit2, Trash2 } from "lucide-react";
import {
  useRegisterCustomer,
  useCustomers,
  useUpdateCustomer,
  useDeleteCustomer,
  type CustomerResponse,
} from "../hooks/useCustomer";

type Customer = CustomerResponse;

const staticColumns: Column<Customer>[] = [
  {
    key: "name",
    label: "Customer",
    render: (_val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {row.name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-slate-500">ID: {row.id}</div>
        </div>
      </div>
    ),
  },
  { key: "idCard", label: "ID Card" },
  { key: "phoneNumber", label: "Phone" },
  {
    key: "totalLoans",
    label: "Total Loans",
    render: (loans) => (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
        {loans} loans
      </span>
    ),
  },
  {
    key: "totalBorrowed",
    label: "Total Borrowed",
    render: (val) => (
      <span className="font-bold text-slate-900">
        ₵{Number(val).toLocaleString()}
      </span>
    ),
  },
];

const Customers: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [form, setForm] = useState<
    Omit<
      Customer,
      "id" | "totalLoans" | "totalBorrowed" | "createdAt" | "loanHistory"
    >
  >({
    name: "",
    idCard: "",
    phoneNumber: "",
    maritalStatus: "",
    employmentStatus: "",
    employerName: "",
    dateOfBirth: "",
    address: "",
  });
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useCustomers(currentPage, pageSize);

  const registerCustomer = useRegisterCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  if (isLoading) {
    return <CustomersSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Customers</h2>
            <p className="text-slate-600 mt-1">
              Manage all registered customers
            </p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 font-medium">
            Error loading customers
          </div>
          <div className="text-red-500 text-sm mt-1">
            {(error as unknown as { message?: string })?.message ||
              "Failed to load customers"}
          </div>
        </div>
      </div>
    );
  }

  const customers = paginatedData?.content ?? [];

  const filtered = customers.filter(
    (c: Customer) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.idCard.toLowerCase().includes(search.toLowerCase()) ||
      (c.phoneNumber && c.phoneNumber.includes(search))
  );

  const handleOpenModal = (type: "add" | "edit", customer?: Customer) => {
    setModalType(type);
    setSelectedCustomer(customer || null);
    if (type === "edit" && customer) {
      setForm({
        name: customer.name,
        idCard: customer.idCard,
        phoneNumber: customer.phoneNumber,
        maritalStatus: customer.maritalStatus,
        employmentStatus: customer.employmentStatus,
        employerName: customer.employerName,
        dateOfBirth: customer.dateOfBirth,
        address: customer.address,
      });
    } else {
      setForm({
        name: "",
        idCard: "",
        phoneNumber: "",
        maritalStatus: "",
        employmentStatus: "",
        employerName: "",
        dateOfBirth: "",
        address: "",
      });
    }
    setTouched({});
    setFormError("");
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const validate = () => {
    if (!form.name.trim() || !form.idCard.trim() || !form.phoneNumber.trim()) {
      setFormError("All fields are required.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (modalType === "add") {
        await registerCustomer.mutateAsync({
          name: form.name,
          maritalStatus: form.maritalStatus,
          employmentStatus: form.employmentStatus,
          employerName: form.employerName,
          dateOfBirth: form.dateOfBirth,
          idCard: form.idCard,
          address: form.address,
          phoneNumber: form.phoneNumber,
        });
      } else if (modalType === "edit" && selectedCustomer) {
        await updateCustomer.mutateAsync({
          id: selectedCustomer.id,
          form: form,
        });
      }
      setModalOpen(false);
    } catch (error) {
      setFormError(
        error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message ||
              `${modalType === "add" ? "Registration" : "Update"} failed`
          : `${modalType === "add" ? "Registration" : "Update"} failed`
      );
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? This action cannot be undone."
      )
    ) {
      try {
        await deleteCustomer.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const columns: Column<Customer>[] = [
    ...staticColumns,
    {
      key: "id",
      label: "Actions",
      render: (_val, row) => (
        <div className="flex gap-2 justify-center">
          <Link to={`/customers/${row.id}`} className="inline-flex">
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
              aria-label="View"
              title="View customer details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-200"
            aria-label="Edit"
            title="Edit customer"
            onClick={() => handleOpenModal("edit", row)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
            aria-label="Delete"
            title="Delete customer"
            onClick={() => handleDeleteCustomer(row.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Customers</h2>
          <p className="text-slate-600 mt-1">Manage all registered customers</p>
        </div>
        <Button leftIcon={<Plus />} onClick={() => handleOpenModal("add")}>
          Register Customer
        </Button>
      </div>
      <Card className="">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="w-5 h-5 text-slate-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name, ID card, or phone..."
            />
          </div>
          <Button
            variant="secondary"
            leftIcon={<Filter />}
            onClick={() => setFilterOpen((o) => !o)}
          >
            Filters
          </Button>
        </div>
        <Table columns={columns} data={filtered} />

        {/* Pagination */}
        {paginatedData && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={paginatedData.totalPages}
              totalElements={paginatedData.totalElements}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
      {/* Filter modal placeholder */}
      <Modal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filters"
      >
        <p className="text-slate-700">Filter options coming soon.</p>
      </Modal>
      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalType === "add" ? "Register Customer" : "Edit Customer"}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Full Name*"
            value={form.name}
            onChange={(e) => {
              setForm((v) => ({ ...v, name: e.target.value }));
              setTouched((t) => ({ ...t, name: true }));
            }}
            error={touched.name && !form.name.trim() ? "Required" : ""}
          />
          <Input
            label="ID Card Number*"
            value={form.idCard}
            onChange={(e) => {
              setForm((v) => ({ ...v, idCard: e.target.value }));
              setTouched((t) => ({ ...t, idCard: true }));
            }}
            error={touched.idCard && !form.idCard.trim() ? "Required" : ""}
          />
          <Input
            label="Phone Number*"
            value={form.phoneNumber}
            onChange={(e) => {
              setForm((v) => ({ ...v, phoneNumber: e.target.value }));
              setTouched((t) => ({ ...t, phoneNumber: true }));
            }}
            error={
              touched.phoneNumber && !form.phoneNumber.trim() ? "Required" : ""
            }
          />
          <Input
            label="Marital Status"
            value={form.maritalStatus}
            onChange={(e) =>
              setForm((v) => ({ ...v, maritalStatus: e.target.value }))
            }
          />
          <Input
            label="Employment Status"
            value={form.employmentStatus}
            onChange={(e) =>
              setForm((v) => ({ ...v, employmentStatus: e.target.value }))
            }
          />
          <Input
            label="Employer Name"
            value={form.employerName}
            onChange={(e) =>
              setForm((v) => ({ ...v, employerName: e.target.value }))
            }
          />
          <Input
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm((v) => ({ ...v, dateOfBirth: e.target.value }))
            }
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) =>
              setForm((v) => ({ ...v, address: e.target.value }))
            }
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
                !form.name.trim() ||
                !form.idCard.trim() ||
                !form.phoneNumber.trim() ||
                registerCustomer.isPending
              }
            >
              {registerCustomer.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
