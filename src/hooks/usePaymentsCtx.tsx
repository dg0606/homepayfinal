import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { STORAGE_KEYS } from "../data/seed";
import { Payment, Service } from "../models";

interface PaymentsContextType {
  payments: Payment[];
  isLoading: boolean;
  addPayment: (service: Service, paidBy: string, paidDate: string) => Payment;
  getPaymentsByMonth: (year: number, month: number) => Payment[];
}

const PaymentsContext = createContext<PaymentsContextType | null>(null);

export function usePaymentsCtx() {
  const context = useContext(PaymentsContext);
  if (!context) throw new Error("usePaymentsCtx must be used within PaymentsProvider");
  return context;
}

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (stored) {
      setPayments(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const addPayment = useCallback((service: Service, paidBy: string, paidDate: string) => {
    const payment: Payment = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.type,
      amount: service.amount,
      paidBy,
      paidDate,
      dueDate: service.dueDate,
      status: "pagado",
    };
    setPayments((prev) => {
      const updated = [...prev, payment];
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
      return updated;
    });
    return payment;
  }, []);

  const getPaymentsByMonth = useCallback((year: number, month: number) => {
    return payments.filter((p) => {
      const date = new Date(p.paidDate);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [payments]);

  return (
    <PaymentsContext.Provider value={{ payments, isLoading, addPayment, getPaymentsByMonth }}>
      {children}
    </PaymentsContext.Provider>
  );
}