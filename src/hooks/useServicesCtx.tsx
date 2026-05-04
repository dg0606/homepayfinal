import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { STORAGE_KEYS } from "../data/seed";
import { Service } from "../models";

interface ServicesContextType {
  services: Service[];
  isLoading: boolean;
  addService: (service: Omit<Service, "id">) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  markAsPaid: (id: string, paidBy: string, paidDate: string, recurrence: Service["recurrence"]) => void;
}

const ServicesContext = createContext<ServicesContextType | null>(null);

export function useServicesCtx() {
  const context = useContext(ServicesContext);
  if (!context) throw new Error("useServicesCtx must be used within ServicesProvider");
  return context;
}

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (stored) {
      let services = JSON.parse(stored) as Service[];
      services = autoResetRecurring(services);
      setServices(services);
    }
    setIsLoading(false);
  }, []);

  const autoResetRecurring = (services: Service[]): Service[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let changed = false;
    const updated = services.map((s) => {
      if (s.recurrence && s.isPaid && s.nextDueDate) {
        const nextDue = new Date(s.nextDueDate);
        if (nextDue < today) {
          changed = true;
          return {
            ...s,
            dueDate: s.nextDueDate,
            isPaid: false,
            paidBy: undefined,
            paidDate: undefined,
            nextDueDate: undefined,
          };
        }
      }
      return s;
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    }
    return updated;
  };

  const addService = useCallback((service: Omit<Service, "id">) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    };
    setServices((prev) => {
      const updated = [...prev, newService];
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      return updated;
    });
    return newService;
  }, []);

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAsPaid = useCallback((id: string, paidBy: string, paidDate: string, recurrence: Service["recurrence"]) => {
    const payer = paidBy || "Yo";
    setServices((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== id) return s;
        if (recurrence) {
          const nextDue = new Date(s.dueDate);
          switch (recurrence) {
            case "mensual": nextDue.setMonth(nextDue.getMonth() + 1); break;
            case "bimestral": nextDue.setMonth(nextDue.getMonth() + 2); break;
            case "trimestral": nextDue.setMonth(nextDue.getMonth() + 3); break;
          }
          return {
            ...s,
            isPaid: true,
            paidBy: payer,
            paidDate,
            nextDueDate: nextDue.toISOString().split("T")[0],
          };
        }
        return { ...s, isPaid: true, paidBy: payer, paidDate };
      });
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <ServicesContext.Provider value={{ services, isLoading, addService, updateService, deleteService, markAsPaid }}>
      {children}
    </ServicesContext.Provider>
  );
}