import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { STORAGE_KEYS } from "../data/seed";
import { Reminder } from "../models";

interface RemindersContextType {
  reminders: Reminder[];
  isLoading: boolean;
  addReminder: (reminder: Omit<Reminder, "id">) => Reminder;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
}

const RemindersContext = createContext<RemindersContextType | null>(null);

export function useRemindersCtx() {
  const context = useContext(RemindersContext);
  if (!context) throw new Error("useRemindersCtx must be used within RemindersProvider");
  return context;
}

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    setReminders(stored ? JSON.parse(stored) : []);
    setIsLoading(false);
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, "id">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    };
    setReminders((prev) => {
      const updated = [...prev, newReminder];
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      return updated;
    });
    return newReminder;
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r));
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <RemindersContext.Provider value={{ reminders, isLoading, addReminder, updateReminder, deleteReminder, toggleReminder }}>
      {children}
    </RemindersContext.Provider>
  );
}