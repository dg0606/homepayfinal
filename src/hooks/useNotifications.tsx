import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Reminder, Service, NotificationPermissionStatus } from "../models";
import { isNativePlatform } from "../utils/platform";

interface NotificationsContextType {
  permissionGranted: boolean;
  permissionStatus: NotificationPermissionStatus;
  isWeb: boolean;
  requestPermission: () => Promise<boolean>;
  scheduleReminder: (reminder: Reminder, services?: Service[]) => Promise<void>;
  cancelReminder: (reminderId: string) => Promise<void>;
  cancelAllReminders: () => Promise<void>;
  rescheduleReminders: (reminders: Reminder[], services?: Service[]) => Promise<void>;
  fireTestNotification: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function useNotificationsCtx() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotificationsCtx must be used within NotificationsProvider");
  return context;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>("unknown");
  const isWeb = !isNativePlatform();

  useEffect(() => {
    if (isWeb) {
      setPermissionStatus("unavailable");
      return;
    }
    checkPermissions();
  }, [isWeb]);

  const checkPermissions = async () => {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const result = await LocalNotifications.checkPermissions();
      if (result.display === "granted") {
        setPermissionGranted(true);
        setPermissionStatus("granted");
      } else if (result.display === "denied") {
        setPermissionGranted(false);
        setPermissionStatus("denied");
      } else {
        setPermissionStatus("prompt");
      }
    } catch {
      setPermissionStatus("unknown");
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (isWeb) return false;
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const result = await LocalNotifications.requestPermissions();
      if (result.display === "granted") {
        setPermissionGranted(true);
        setPermissionStatus("granted");
        return true;
      } else {
        setPermissionGranted(false);
        setPermissionStatus("denied");
        return false;
      }
    } catch {
      return false;
    }
  }, [isWeb]);

  const scheduleReminder = useCallback(async (reminder: Reminder, services?: Service[]) => {
    if (isWeb || !permissionGranted || !reminder.isActive) return;

    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");

      const serviceName = services && reminder.serviceId
        ? services.find((s) => s.id === reminder.serviceId)?.name || "Servicio"
        : "HomePay";

      const [hours, minutes] = reminder.time.split(":").map(Number);
      const now = new Date();
      const scheduleDate = new Date();
      scheduleDate.setHours(hours, minutes, 0, 0);

      if (scheduleDate <= now) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: reminder.id.charCodeAt(0) + reminder.id.charCodeAt(reminder.id.length - 1),
            title: "HomePay - Recordatorio",
            body: `Es hora de pagar: ${serviceName}`,
            schedule: {
              at: scheduleDate,
            },
            sound: reminder.notificationType === "sonido" ? "default" : undefined,
            actionTypeId: "REMINDER",
          },
        ],
      });
    } catch (e) {
      console.warn("Failed to schedule notification:", e);
    }
  }, [isWeb, permissionGranted]);

  const cancelReminder = useCallback(async (reminderId: string) => {
    if (isWeb) return;
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const id = reminderId.charCodeAt(0) + reminderId.charCodeAt(reminderId.length - 1);
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (e) {
      console.warn("Failed to cancel notification:", e);
    }
  }, [isWeb]);

  const cancelAllReminders = useCallback(async () => {
    if (isWeb) return;
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications.map(n => ({ id: n.id })) });
      }
    } catch (e) {
      console.warn("Failed to cancel all notifications:", e);
    }
  }, [isWeb]);

  const rescheduleReminders = useCallback(async (reminders: Reminder[], services?: Service[]) => {
    await cancelAllReminders();
    for (const reminder of reminders) {
      if (reminder.isActive) {
        await scheduleReminder(reminder, services);
      }
    }
  }, [cancelAllReminders, scheduleReminder]);

  const fireTestNotification = useCallback(async () => {
    if (isWeb) return;
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const now = new Date();
      now.setSeconds(now.getSeconds() + 5);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 9999,
            title: "HomePay - Prueba",
            body: "Esta es una notificación de prueba",
            schedule: {
              at: now,
            },
            sound: "default",
          },
        ],
      });
    } catch (e) {
      console.warn("Failed to fire test notification:", e);
    }
  }, [isWeb, permissionGranted, requestPermission]);

  return (
    <NotificationsContext.Provider
      value={{
        permissionGranted,
        permissionStatus,
        isWeb,
        requestPermission,
        scheduleReminder,
        cancelReminder,
        cancelAllReminders,
        rescheduleReminders,
        fireTestNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
