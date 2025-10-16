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

export interface LoanRequest {
  customerId: number;
  principal: number;
  interestRate?: number;
  timePeriodYears?: number;
  dateIssued: string;
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

export interface SpringPageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export function useCreateLoan() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (form: LoanRequest) => {
      return toast.promise(
        (async () => {
          try {
            const res = await api.post("/loans", form, suppressToast());
            if (!res.data.success)
              throw new Error(res.data.message || "Loan creation failed");
            return res.data.data;
          } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const message =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Loan creation failed";
            throw new Error(message);
          }
        })(),
        {
          loading: "Creating loan...",
          success: () => `Loan created successfully!`,
          error: (err) => err.message || "Failed to create loan",
        }
      );
    },
  });
}

export function useLoans(page: number = 0, size: number = 7) {
  const toast = useToast();

  return useQuery({
    queryKey: ["loans", page, size],
    queryFn: async () => {
      try {
        const res = await api.get(
          `/loans?page=${page}&size=${size}`,
          suppressToast()
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Failed to fetch loans");
        const springPage = res.data.data as SpringPageResponse<LoanResponse>;
        return {
          content: springPage.content,
          pageNumber: springPage.number,
          pageSize: springPage.size,
          totalElements: springPage.totalElements,
          totalPages: springPage.totalPages,
          last: springPage.last,
          first: springPage.first,
        } as PaginatedResponse<LoanResponse>;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Failed to fetch loans";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}

export function useLoanDetail(id: string | undefined) {
  const toast = useToast();

  return useQuery({
    queryKey: ["loan", id],
    enabled: !!id,
    queryFn: async () => {
      try {
        const res = await api.get(`/loans/${id}`, suppressToast());
        if (!res.data.success)
          throw new Error(res.data.message || "Failed to fetch loan");
        return res.data.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Failed to fetch loan";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}

export function useUpdateLoan() {
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: LoanRequest }) => {
      return toast.promise(
        (async () => {
          try {
            const res = await api.put(`/loans/${id}`, form, suppressToast());
            if (!res.data.success)
              throw new Error(res.data.message || "Loan update failed");
            return res.data.data;
          } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const message =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Loan update failed";
            throw new Error(message);
          }
        })(),
        {
          loading: "Updating loan...",
          success: () => `Loan updated successfully!`,
          error: (err) => err.message || "Failed to update loan",
        }
      );
    },
  });
}

export function useDeleteLoan() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      return toast.promise(
        (async () => {
          try {
            const res = await api.delete(`/loans/${id}`, suppressToast());
            if (!res.data.success)
              throw new Error(res.data.message || "Loan deletion failed");
            return res.data.data;
          } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const message =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Loan deletion failed";
            throw new Error(message);
          }
        })(),
        {
          loading: "Deleting loan...",
          success: () => `Loan deleted successfully!`,
          error: (err) => err.message || "Failed to delete loan",
        }
      );
    },
  });
}

export function useCustomerLoans(customerId: string | undefined) {
  const toast = useToast();

  return useQuery({
    queryKey: ["customerLoans", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      try {
        const res = await api.get(
          `/loans/customer/${customerId}`,
          suppressToast()
        );
        if (!res.data.success)
          throw new Error(res.data.message || "Failed to fetch customer loans");
        return res.data.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Failed to fetch customer loans";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}
