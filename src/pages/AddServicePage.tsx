import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, TypeSelector } from "../components";
import { useServicesCtx, useMembersCtx, useToast } from "../hooks";
import { ServiceType, Recurrence } from "../models";
import { SERVICE_LABELS } from "../utils";

export function AddServicePage() {
  const navigate = useNavigate();
  const { addService } = useServicesCtx();
  const { members } = useMembersCtx();
  const { showToast } = useToast();

  const [type, setType] = useState<ServiceType | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState<Recurrence>(null);
  const [paidBy, setPaidBy] = useState("");

  const handleSubmit = () => {
    if (!type || !amount || !dueDate) return;

    addService({
      type,
      name: name || SERVICE_LABELS[type],
      amount: parseFloat(amount),
      dueDate,
      icon: type,
      isPaid: false,
      recurrence,
      paidBy: paidBy || undefined,
    });

    showToast("Servicio guardado", "success");
    navigate("/");
  };

  const isValid = type && amount && parseFloat(amount) > 0 && dueDate;

  return (
    <div className="app-container">
      <Header title="Agregar Servicio" onBack={() => navigate("/")} />
      <div className="page-content">
        <div className="input-group">
          <label className="input-label">Tipo de servicio</label>
          <TypeSelector selected={type} onSelect={setType} />
        </div>

        <div className="input-group">
          <label className="input-label">Nombre (opcional)</label>
          <input
            type="text"
            className="input"
            placeholder="Ej: Agua casa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Monto ($ MXN)</label>
          <input
            type="number"
            className="input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Fecha de vencimiento</label>
          <input
            type="date"
            className="input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Recurrencia</label>
          <select
            className="select"
            value={recurrence || ""}
            onChange={(e) =>
              setRecurrence(
                (e.target.value as Recurrence) || null
              )
            }
          >
            <option value="">Sin recurrencia</option>
            <option value="mensual">Mensual</option>
            <option value="bimestral">Bimestral</option>
            <option value="trimestral">Trimestral</option>
          </select>
        </div>

        {members.length > 0 && (
          <div className="input-group">
            <label className="input-label">Quién paga (opcional)</label>
            <select
              className="select"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isValid}
          style={{ marginTop: 8 }}
        >
          Guardar Servicio
        </button>
      </div>
    </div>
  );
}