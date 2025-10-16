import { useMutation, useQuery } from "@tanstack/react-query";
import api, { suppressToast } from "../api/base";
import { useToast } from "../contexts/ToastContext";

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface CustomerReg {
  name: string;
  maritalStatus: string;
  employmentStatus: string;
  employerName: string;
  dateOfBirth: string;
  idCard: string;
  address: string;
  phoneNumber: string;
}

export interface CustomerResponse {
  id: number;
  name: string;
  idCard: string;
  phoneNumber: string;
  maritalStatus: string;
  employmentStatus: string;
  employerName: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  totalLoans: number;
  totalBorrowed: number;
  loanHistory: LoanResponse[] | null;
}

export interface LoanResponse {
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

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export function useRegisterCustomer() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (form: CustomerReg) => {
      return toast.promise(
        (async () => {
          try {
            const res = await api.post(
              "/customers/register",
              form,
              suppressToast()
            );
            if (!res.data.success)
              throw new Error(
                res.data.message || "Customer registration failed"
              );
            return res.data.data;
          } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const message =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Customer registration failed";
            throw new Error(message);
          }
        })(),
        {
          loading: "Registering customer...",
          success: (data) => `Customer ${data.name} registered successfully!`,
          error: (err) => err.message || "Failed to register customer",
        }
      );
    },
  });
}

export function useCustomers(page: number = 0, size: number = 7) {
  const toast = useToast();

  return useQuery({
    queryKey: ["customers", page, size],
    queryFn: async () => {
      try {
        const res = await api.get(
          `/customers?page=${page}&size=${size}`,
          suppressToast()
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Failed to fetch customers");
        return res.data.data as PaginatedResponse<CustomerResponse>;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Failed to fetch customers";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}

export function useCustomerDetail(id: string | undefined) {
  const toast = useToast();

  return useQuery({
    queryKey: ["customer", id],
    enabled: !!id,
    queryFn: async () => {
      try {
        const res = await api.get(`/customers/${id}`, suppressToast());
        if (!res.data.success)
          throw new Error(res.data.message || "Failed to fetch customer");
        return res.data.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Failed to fetch customer";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}

export function useUpdateCustomer() {
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: CustomerReg }) => {
      return toast.promise(
        (async () => {
          try {
            const res = await api.put(
              `/customers/${id}`,
              form,
              suppressToast()
            );
            if (!res.data.success)
              throw new Error(res.data.message || "Customer update failed");
            return res.data.data;
          } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const message =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Customer update failed";
            throw new Error(message);
          }
        })(),
        {
          loading: "Updating customer...",
          success: (data) => `Customer ${data.name} updated successfully!`,
          error: (err) => err.message || "Failed to update customer",
        }
      );
    },
  });
}

export function useDeleteCustomer() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      return toast.promise(
        (async () => {
          try {
            const res = await api.delete(`/customers/${id}`, suppressToast());
            if (!res.data.success)
              throw new Error(res.data.message || "Customer deletion failed");
            return res.data.data;
          } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const message =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Customer deletion failed";
            throw new Error(message);
          }
        })(),
        {
          loading: "Deleting customer...",
          success: () => `Customer deleted successfully!`,
          error: (err) => err.message || "Failed to delete customer",
        }
      );
    },
  });
}
