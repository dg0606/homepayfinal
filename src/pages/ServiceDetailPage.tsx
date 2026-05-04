import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, ServiceIcon } from "../components";
import { useServicesCtx, usePaymentsCtx, useMembersCtx, useToast } from "../hooks";
import { formatCurrency, formatDate } from "../utils";

export function ServiceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { services, markAsPaid, deleteService } = useServicesCtx();
  const { addPayment } = usePaymentsCtx();
  const { members } = useMembersCtx();
  const { showToast } = useToast();

  const service = services.find((s) => s.id === id);

  const [paidBy, setPaidBy] = useState("");
  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showPayment, setShowPayment] = useState(false);

  if (!service) {
    navigate("/");
    return null;
  }

  const handleMarkPaid = () => {
    if (!paidDate) return;

    const payer = paidBy || "Yo";

    addPayment(service, payer, paidDate);
    markAsPaid(service.id, payer, paidDate, service.recurrence);
    showToast("Pago registrado", "success");
    navigate("/");
  };

  const handleDelete = () => {
    if (confirm("¿Eliminar este servicio?")) {
      deleteService(service.id);
      showToast("Servicio eliminado", "info");
      navigate("/");
    }
  };

  return (
    <div className="app-container">
      <Header title={service.name} onBack={() => navigate("/")} />
      <div className="page-content">
        <div className="card" style={{ textAlign: "center", padding: 24 }}>
          <ServiceIcon type={service.type} size={72} />
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            {service.name}
          </h2>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>
            {formatCurrency(service.amount)}
          </div>
          <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>
            Vence: {formatDate(service.dueDate)}
          </div>
          {service.isPaid && service.paidBy && (
            <div style={{ color: "var(--paid)", marginTop: 8 }}>
              Pagado por {service.paidBy} el {formatDate(service.paidDate!)}
            </div>
          )}
          {service.isPaid && service.nextDueDate && (
            <div style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 14 }}>
              Próximo vencimiento: {formatDate(service.nextDueDate)}
            </div>
          )}
          {service.recurrence && (
            <div
              className="badge badge-primary"
              style={{ marginTop: 12, textTransform: "capitalize" }}
            >
              {service.recurrence}
            </div>
          )}
        </div>

        {!service.isPaid && (
          <div className="card">
            {!showPayment ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowPayment(true)}
              >
                Marcar como Pagado
              </button>
            ) : (
              <>
                <h3
                  className="card-title"
                  style={{ marginBottom: 16 }}
                >
                  Registrar Pago
                </h3>

                <div className="input-group">
                  <label className="input-label">Quién realizó el pago (opcional)</label>
                  <select
                    className="select"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                  >
                    <option value="">Yo</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Fecha de pago</label>
                  <input
                    type="date"
                    className="input"
                    value={paidDate}
                    onChange={(e) => setPaidDate(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowPayment(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleMarkPaid}
                    disabled={!paidDate}
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <button
          className="btn btn-danger"
          onClick={handleDelete}
          style={{ marginTop: 12 }}
        >
          Eliminar Servicio
        </button>
      </div>
    </div>
  );
}