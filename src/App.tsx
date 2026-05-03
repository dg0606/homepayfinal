import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ServicesProvider,
  PaymentsProvider,
  MembersProvider,
  RemindersProvider,
  SettingsProvider,
  NotificationsProvider,
  ToastProvider,
} from "./hooks";
import { Toast } from "./components/Toast";
import {
  HomePage,
  AddServicePage,
  ServiceDetailPage,
  HistoryPage,
  StatsPage,
  SettingsPage,
  RemindersPage,
  AddReminderPage,
  MembersPage,
  EditReminderPage,
} from "./pages";
import { useSettingsCtx } from "./hooks/useSettingsCtx";
import { useEffect } from "react";

function ThemeManager() {
  const { settings } = useSettingsCtx();

  useEffect(() => {
    document.body.className = settings.theme === "dark" ? "dark-theme" : "";
  }, [settings.theme]);

  return null;
}

export default function App() {
  return (
    <SettingsProvider>
      <ServicesProvider>
        <PaymentsProvider>
          <MembersProvider>
            <RemindersProvider>
              <NotificationsProvider>
                <ToastProvider>
                  <ThemeManager />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/add-service" element={<AddServicePage />} />
                      <Route path="/service/:id" element={<ServiceDetailPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/stats" element={<StatsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/reminders" element={<RemindersPage />} />
                      <Route path="/add-reminder" element={<AddReminderPage />} />
                      <Route path="/edit-reminder/:id" element={<EditReminderPage />} />
                      <Route path="/members" element={<MembersPage />} />
                    </Routes>
                  </BrowserRouter>
                  <Toast />
                </ToastProvider>
              </NotificationsProvider>
            </RemindersProvider>
          </MembersProvider>
        </PaymentsProvider>
      </ServicesProvider>
    </SettingsProvider>
  );
}