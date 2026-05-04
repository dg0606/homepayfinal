import { useNavigate } from "react-router-dom";
import { Header, BottomTabs } from "../components";
import { useServicesCtx, useSettingsCtx, useNotificationsCtx, useToast } from "../hooks";

export function SettingsPage() {
  const navigate = useNavigate();
  const { services } = useServicesCtx();
  const { settings, updateSettings } = useSettingsCtx();
  const { permissionStatus, requestPermission, fireTestNotification } = useNotificationsCtx();
  const { showToast } = useToast();

  const unpaidCount = services.filter((s) => !s.isPaid).length;

  const handleNotificationToggle = async () => {
    if (!settings.notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        updateSettings({ notificationsEnabled: true });
        showToast("Notificaciones activadas", "success");
      } else {
        showToast("Permiso de notificaciones denegado", "error");
      }
    } else {
      updateSettings({ notificationsEnabled: false });
    }
  };

  const handleTestNotification = async () => {
    await fireTestNotification();
    showToast("Notificación de prueba programada", "info");
  };

  return (
    <div className="app-container">
      <Header title="Configuración" />
      <div className="page-content">
        <div className="section-title">General</div>
        <div className="card" style={{ padding: 0 }}>
          <div
            className="list-item"
            style={{ padding: "14px 16px", cursor: "pointer" }}
            onClick={() => navigate("/reminders")}
          >
            <span style={{ fontSize: 22 }}>🔔</span>
            <div className="list-item-content">
              <div className="list-item-title">Recordatorios</div>
              <div className="list-item-subtitle">
                {settings.notificationsEnabled ? "Activados" : "Desactivados"}
              </div>
            </div>
            <span style={{ color: "var(--text-secondary)" }}>→</span>
          </div>

          <div
            className="list-item"
            style={{ padding: "14px 16px", cursor: "pointer" }}
            onClick={() => navigate("/members")}
          >
            <span style={{ fontSize: 22 }}>👥</span>
            <div className="list-item-content">
              <div className="list-item-title">Miembros del hogar</div>
              <div className="list-item-subtitle">Gestionar miembros</div>
            </div>
            <span style={{ color: "var(--text-secondary)" }}>→</span>
          </div>

          <div className="list-item" style={{ padding: "14px 16px" }}>
            <span style={{ fontSize: 22 }}>🌙</span>
            <div className="list-item-content">
              <div className="list-item-title">Modo oscuro</div>
              <div className="list-item-subtitle">
                {settings.theme === "dark" ? "Activado" : "Desactivado"}
              </div>
            </div>
            <button
              className={`toggle ${settings.theme === "dark" ? "active" : ""}`}
              onClick={() =>
                updateSettings({
                  theme: settings.theme === "dark" ? "light" : "dark",
                })
              }
            />
          </div>
        </div>

        <div className="section-title">Notificaciones</div>
        {settings.notificationsEnabled && permissionStatus === "unavailable" && (
          <div className="card" style={{ padding: "14px 16px", marginBottom: 12, background: "var(--warning)", color: "#fff" }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              Las notificaciones solo están disponibles en la app nativa (iOS/Android)
            </div>
          </div>
        )}
        <div className="card" style={{ padding: 0 }}>
          <div className="list-item" style={{ padding: "14px 16px" }}>
            <span style={{ fontSize: 22 }}>📳</span>
            <div className="list-item-content">
              <div className="list-item-title">Activar notificaciones</div>
              <div className="list-item-subtitle">
                {permissionStatus === "unavailable"
                  ? "No disponible en la versión web"
                  : permissionStatus === "denied"
                  ? "Permiso denegado (configura en iOS)"
                  : permissionStatus === "granted"
                  ? "Recibir alertas de pagos"
                  : "Recibir alertas de pagos"}
              </div>
            </div>
            <button
              className={`toggle ${settings.notificationsEnabled ? "active" : ""}`}
              onClick={handleNotificationToggle}
              disabled={permissionStatus === "unavailable"}
              style={{ opacity: permissionStatus === "unavailable" ? 0.4 : 1, cursor: permissionStatus === "unavailable" ? "not-allowed" : "pointer" }}
            />
          </div>

          <div className="list-item" style={{ padding: "14px 16px" }}>
            <span style={{ fontSize: 22 }}>⏰</span>
            <div className="list-item-content">
              <div className="list-item-title">Hora por defecto</div>
              <div className="list-item-subtitle">
                {settings.defaultReminderTime}
              </div>
            </div>
            <input
              type="time"
              className="input"
              style={{ width: 100, padding: "8px" }}
              value={settings.defaultReminderTime}
              onChange={(e) =>
                updateSettings({ defaultReminderTime: e.target.value })
              }
            />
          </div>

          <div
            className="list-item"
            style={{ padding: "14px 16px", cursor: permissionStatus === "unavailable" ? "not-allowed" : "pointer", opacity: permissionStatus === "unavailable" ? 0.4 : 1 }}
            onClick={() => {
              if (permissionStatus !== "unavailable") handleTestNotification();
            }}
          >
            <span style={{ fontSize: 22 }}>🧪</span>
            <div className="list-item-content">
              <div className="list-item-title">Probar notificación</div>
              <div className="list-item-subtitle">
                {permissionStatus === "unavailable" ? "No disponible en web" : "Enviar una prueba en 5 segundos"}
              </div>
            </div>
            <span style={{ color: "var(--text-secondary)" }}>→</span>
          </div>
        </div>

        <div className="section-title">Resumen</div>
        <div className="card">
          <div className="summary-row">
            <span className="summary-label">Total servicios</span>
            <span className="summary-value">{services.length}</span>
          </div>
          <div className="summary-row" style={{ marginTop: 8 }}>
            <span className="summary-label">Pendientes por pagar</span>
            <span className="summary-value pending">{unpaidCount}</span>
          </div>
          <div className="summary-row" style={{ marginTop: 8 }}>
            <span className="summary-label">Moneda</span>
            <span className="summary-value">{settings.currency}</span>
          </div>
        </div>
      </div>
      <BottomTabs />
    </div>
  );
}