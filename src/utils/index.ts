import { ServiceType, Recurrence } from "../models";

export const SERVICE_LABELS: Record<ServiceType, string> = {
  agua: "Agua",
  luz: "Luz",
  gas: "Gas",
  internet: "Internet",
  telefono: "Teléfono",
  otro: "Otro",
};

export const SERVICE_ICONS: Record<ServiceType, string> = {
  agua: "water",
  luz: "lightning",
  gas: "fire",
  internet: "wifi",
  telefono: "phone",
  otro: "other",
};

export const COLORS = {
  primary: "#2196F3",
  secondary: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  background: "#F5F7FA",
  cardBg: "#FFFFFF",
  textPrimary: "#333333",
  textSecondary: "#757575",
  border: "#E0E0E0",
  paid: "#4CAF50",
  pending: "#FF9800",
  overdue: "#F44336",
} as const;

export const MEMBER_COLORS = [
  "#2196F3",
  "#E91E63",
  "#4CAF50",
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
  "#795548",
  "#607D8B",
] as const;

export const CURRENCY_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

export function formatCurrency(amount: number): string {
  return CURRENCY_FORMAT.format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", DATE_FORMAT_OPTIONS);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function isOverdue(dueDate: string, isPaid: boolean): boolean {
  if (isPaid) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  return due < today;
}

export function getDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getNextDueDate(
  currentDueDate: string,
  recurrence: NonNullable<Recurrence>
): string {
  const date = new Date(currentDueDate);
  switch (recurrence) {
    case "mensual":
      date.setMonth(date.getMonth() + 1);
      break;
    case "bimestral":
      date.setMonth(date.getMonth() + 2);
      break;
    case "trimestral":
      date.setMonth(date.getMonth() + 3);
      break;
  }
  return date.toISOString().split("T")[0];
}