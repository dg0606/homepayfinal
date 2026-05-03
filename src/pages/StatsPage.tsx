import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, BottomTabs, EmptyState } from "../components";
import { useServicesCtx, usePaymentsCtx } from "../hooks";
import { ServiceType } from "../models";
import { formatCurrency, isOverdue } from "../utils";
import { ServiceIcon } from "../components/ServiceIcon";

const SERVICE_COLORS: Record<ServiceType, string> = {
  agua: "#2196F3",
  luz: "#FFC107",
  gas: "#FF5722",
  internet: "#4CAF50",
  telefono: "#9C27B0",
  otro: "#607D8B",
};

export function StatsPage() {
  const navigate = useNavigate();
  const { services } = useServicesCtx();
  const { getPaymentsByMonth } = usePaymentsCtx();

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const monthPayments = getPaymentsByMonth(selectedYear, selectedMonth);
  const totalPaid = monthPayments.reduce((sum, p) => sum + p.amount, 0);

  const pendingServices = services.filter((s) => !s.isPaid && !isOverdue(s.dueDate, false));
  const overdueServices = services.filter((s) => !s.isPaid && isOverdue(s.dueDate, false));
  const totalPending = pendingServices.reduce((sum, s) => sum + s.amount, 0);
  const totalOverdue = overdueServices.reduce((sum, s) => sum + s.amount, 0);

  const byType: Record<ServiceType, number> = {
    agua: 0, luz: 0, gas: 0, internet: 0, telefono: 0, otro: 0
  };
  monthPayments.forEach((p) => {
    byType[p.serviceType] += p.amount;
  });

  const maxAmount = Math.max(...Object.values(byType), 1);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="app-container">
      <Header title="Estadísticas" />
      <div className="page-content">
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="form-row">
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Mes</label>
              <select
                className="select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {monthNames.map((name, i) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Año</label>
              <select
                className="select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-value" style={{ color: "var(--paid)" }}>
              {formatCurrency(totalPaid)}
            </div>
            <div className="stats-label">Pagado</div>
          </div>
          <div className="stats-card">
            <div className="stats-value" style={{ color: "var(--pending)" }}>
              {formatCurrency(totalPending)}
            </div>
            <div className="stats-label">Pendiente</div>
          </div>
          <div className="stats-card">
            <div className="stats-value" style={{ color: "var(--overdue)" }}>
              {formatCurrency(totalOverdue)}
            </div>
            <div className="stats-label">Atrasado</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">
              {monthPayments.length}
            </div>
            <div className="stats-label">Pagos</div>
          </div>
        </div>

        <div className="section-title">Gastos por Servicio</div>
        <div className="card">
          {Object.entries(byType).filter(([, v]) => v > 0).length === 0 ? (
            <EmptyState
              icon="📊"
              title="Sin datos"
              text="No hay pagos registrados para este periodo"
            />
          ) : (
            <div className="bar-chart">
              {(Object.entries(byType) as [ServiceType, number][])
                .filter(([, amount]) => amount > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([type, amount]) => (
                  <div key={type} className="bar-item">
                    <div className="bar-label">
                      <span className="bar-name" style={{ textTransform: "capitalize" }}>
                        {type}
                      </span>
                      <span className="bar-value">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(amount / maxAmount) * 100}%`,
                          background: SERVICE_COLORS[type],
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {pendingServices.length > 0 && (
          <>
            <div className="section-title">Servicios Pendientes</div>
            {pendingServices.map((s) => (
              <div key={s.id} className="card service-card" onClick={() => navigate(`/service/${s.id}`, { state: { service: s } })}>
                <ServiceIcon type={s.type} />
                <div className="service-info">
                  <div className="service-name">{s.name}</div>
                  <div className="service-due">{s.dueDate}</div>
                </div>
                <div className="service-amount" style={{ color: "var(--pending)" }}>
                  {formatCurrency(s.amount)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <BottomTabs />
    </div>
  );
}