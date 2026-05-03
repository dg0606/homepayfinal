import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components";
import { useRemindersCtx, useServicesCtx, useToast, useNotificationsCtx } from "../hooks";
import { Reminder } from "../models";

export function EditReminderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { reminders, updateReminder } = useRemindersCtx();
  const { services } = useServicesCtx();
  const { showToast } = useToast();
  const { scheduleReminder, cancelReminder } = useNotificationsCtx();

  const reminder = reminders.find((r) => r.id === id);

  const [serviceId, setServiceId] = useState("");
  const [time, setTime] = useState("09:00");
  const [frequency, setFrequency] = useState<Reminder["frequency"]>("diario");
  const [notificationType, setNotificationType] = useState<Reminder["notificationType"]>("sonido");

  useEffect(() => {
    if (reminder) {
      setServiceId(reminder.serviceId || "");
      setTime(reminder.time);
      setFrequency(reminder.frequency);
      setNotificationType(reminder.notificationType);
    }
  }, [reminder]);

  if (!reminder) {
    return (
      <div className="app-container">
        <Header title="Editar Recordatorio" onBack={() => navigate("/reminders")} />
        <div className="page-content">
          <p>Recordatorio no encontrado</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    await cancelReminder(reminder.id);

    updateReminder(reminder.id, {
      serviceId: serviceId || undefined,
      time,
      frequency,
      notificationType,
    });

    const updatedReminder: Reminder = {
      ...reminder,
      serviceId: serviceId || undefined,
      time,
      frequency,
      notificationType,
    };

    await scheduleReminder(updatedReminder, services);
    showToast("Recordatorio actualizado", "success");
    navigate("/reminders");
  };

  return (
    <div className="app-container">
      <Header title="Editar Recordatorio" onBack={() => navigate("/reminders")} />
      <div className="page-content">
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
          Actualizar Recordatorio
        </button>
      </div>
    </div>
  );
}