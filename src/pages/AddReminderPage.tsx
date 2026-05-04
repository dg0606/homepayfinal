import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components";
import { useRemindersCtx, useServicesCtx, useToast, useNotificationsCtx } from "../hooks";
import { Reminder } from "../models";

export function AddReminderPage() {
  const navigate = useNavigate();
  const { addReminder } = useRemindersCtx();
  const { services } = useServicesCtx();
  const { showToast } = useToast();
  const { scheduleReminder, isWeb } = useNotificationsCtx();

  const [serviceId, setServiceId] = useState("");
  const [time, setTime] = useState("09:00");
  const [frequency, setFrequency] = useState<Reminder["frequency"]>("diario");
  const [notificationType, setNotificationType] = useState<
    Reminder["notificationType"]
  >("sonido");

  const handleSubmit = async () => {
    const newReminder = addReminder({
      serviceId: serviceId || undefined,
      time,
      frequency,
      notificationType,
      isActive: true,
    });

    await scheduleReminder(newReminder, services);
    showToast("Recordatorio guardado", "success");
    navigate("/reminders");
  };

  return (
    <div className="app-container">
      <Header title="Nuevo Recordatorio" onBack={() => navigate("/reminders")} />
      <div className="page-content">
        {isWeb && (
          <div className="card" style={{ padding: "14px 16px", marginBottom: 12, background: "var(--warning)", color: "#fff" }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              En la versión web las notificaciones no se dispararán
            </div>
          </div>
        )}
        <div className="input-group">
          <label className="input-label">Servicio (opcional)</label>
          <select
            className="select"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Todos los servicios</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Hora</label>
          <input
            type="time"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Frecuencia</label>
          <select
            className="select"
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as Reminder["frequency"])
            }
          >
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Tipo de notificación</label>
          <select
            className="select"
            value={notificationType}
            onChange={(e) =>
              setNotificationType(e.target.value as Reminder["notificationType"])
            }
          >
            <option value="sonido">🔊 Sonido</option>
            <option value="vibracion">📳 Vibración</option>
            <option value="silencioso">🔇 Silencioso</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Guardar Recordatorio
        </button>
      </div>
    </div>
  );
}