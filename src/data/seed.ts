import { Service, Member } from "../models";

export const SEED_SERVICES: Service[] = [];

export const SEED_MEMBERS: Member[] = [];

export const SEED_SETTINGS = {
  notificationsEnabled: true,
  defaultReminderTime: "09:00",
  currency: "MXN",
  theme: "light",
};

export const STORAGE_KEYS = {
  SERVICES: "homepay_services",
  PAYMENTS: "homepay_payments",
  MEMBERS: "homepay_members",
  REMINDERS: "homepay_reminders",
  SETTINGS: "homepay_settings",
  INITIALIZED: "homepay_initialized",
} as const;