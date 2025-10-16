import { useQuery } from "@tanstack/react-query";
import api, { suppressToast } from "../api/base";
import { useToast } from "../contexts/ToastContext";

export interface LoanResponse {
  id: number;
  customerId: number;
  customerName: string;
  principal: string;
  interestRate: string;
  timePeriodYears: number;
  dateIssued: string;
  totalAmountPayable: string;
  status: string;
  createdAt: string;
}

export interface TopCustomer {
  customerId: number;
  customerName: string;
  totalLoans: number;
  totalBorrowed: string;
}

export interface ChartData {
  day: string;
  value: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalLoans: number;
  activeLoans: number;
  pendingLoans: number;
  totalDisbursed: string;
  recentLoans: LoanResponse[];
  topCustomers: TopCustomer[];
  chartData: ChartData[];
}

export function useDashboardStats() {
  const toast = useToast();
  
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard/summary", suppressToast());
        console.log(res.data);
        if (!res.data.success)
          throw new Error(res.data.message || "Failed to fetch dashboard stats");
        return res.data.data as DashboardStats;
      } catch (error: unknown) {
        const axiosError = error as any;
        const message =
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Failed to fetch dashboard stats";
        toast.error(message);
        throw new Error(message);
      }
    },
  });
}
