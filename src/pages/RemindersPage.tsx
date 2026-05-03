import { useNavigate } from "react-router-dom";
import { Header, BottomTabs, EmptyState } from "../components";
import { useRemindersCtx, useServicesCtx, useToast, useNotificationsCtx, useSettingsCtx } from "../hooks";
import { Reminder } from "../models";

export function RemindersPage() {
  const navigate = useNavigate();
  const { reminders, toggleReminder, deleteReminder } = useRemindersCtx();
  const { services } = useServicesCtx();
  const { showToast } = useToast();
  const { scheduleReminder, cancelReminder } = useNotificationsCtx();
  const { settings } = useSettingsCtx();

  const getServiceName = (serviceId?: string) => {
    if (!serviceId) return "Todos los servicios";
    const service = services.find((s) => s.id === serviceId);
    return service?.name || "Servicio eliminado";
  };

  const formatFrequency = (frequency: Reminder["frequency"]) => {
    switch (frequency) {
      case "diario":
        return "Diario";
      case "semanal":
        return "Semanal";
      case "personalizado":
        return "Personalizado";
    }
  };

  const formatNotificationType = (type: Reminder["notificationType"]) => {
    switch (type) {
      case "sonido":
        return "🔊 Sonido";
      case "vibracion":
        return "📳 Vibración";
      case "silencioso":
        return "🔇 Silencioso";
    }
  };

  const handleToggle = async (reminder: Reminder) => {
    await toggleReminder(reminder.id);
    if (!reminder.isActive && settings.notificationsEnabled) {
      await scheduleReminder({ ...reminder, isActive: true });
    } else {
      await cancelReminder(reminder.id);
    }
  };

  const handleDelete = async (reminder: Reminder) => {
    await cancelReminder(reminder.id);
    deleteReminder(reminder.id);
    showToast("Recordatorio eliminado", "info");
  };

  return (
    <div className="app-container">
      <Header
        title="Recordatorios"
        onBack={() => navigate("/settings")}
      />
      <div className="page-content">
        {reminders.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="Sin recordatorios"
            text="Agrega recordatorios para nunca olvidar un pago"
          />
        ) : (
          <div className="card" style={{ padding: 0 }}>
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="list-item"
                style={{ padding: "14px 16px", cursor: "pointer" }}
                onClick={() => navigate(`/edit-reminder/${reminder.id}`)}
              >
                <div style={{ flex: 1 }}>
                  <div className="list-item-title">
                    {getServiceName(reminder.serviceId)}
                  </div>
                  <div className="list-item-subtitle">
                    {reminder.time} · {formatFrequency(reminder.frequency)} ·{" "}
                    {formatNotificationType(reminder.notificationType)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    className={`toggle ${reminder.isActive ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(reminder);
                    }}
                  />
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--error)",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(reminder);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-reminder")}
          style={{ marginTop: 16 }}
        >
          + Agregar Recordatorio
        </button>
      </div>
      <BottomTabs />
    </div>
  );
}