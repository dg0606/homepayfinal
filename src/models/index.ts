export type ServiceType = "agua" | "luz" | "gas" | "internet" | "telefono" | "otro";

export type Recurrence = "mensual" | "bimestral" | "trimestral" | null;

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  amount: number;
  dueDate: string;
  icon: string;
  isPaid: boolean;
  paidBy?: string;
  paidDate?: string;
  recurrence: Recurrence;
}

export interface Payment {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  amount: number;
  paidBy: string;
  paidDate: string;
  dueDate: string;
  status: "pagado" | "pendiente" | "atrasado";
}

export interface Reminder {
  id: string;
  serviceId?: string;
  time: string;
  frequency: "diario" | "semanal" | "personalizado";
  notificationType: "sonido" | "vibracion" | "silencioso";
  isActive: boolean;
  customDays?: number[];
}

export interface Member {
  id: string;
  name: string;
  color: string;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  defaultReminderTime: string;
  currency: string;
  theme: "light" | "dark";
}

export type FilterStatus = "todos" | "pendientes" | "pagados" | "atrasados";

export interface MonthlyStats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  paymentsByType: Record<ServiceType, number>;
  paymentCount: number;
}