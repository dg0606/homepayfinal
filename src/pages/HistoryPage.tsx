import { useState } from "react";
import { Header, BottomTabs, EmptyState } from "../components";
import { usePaymentsCtx } from "../hooks";
import { Payment } from "../models";
import { formatCurrency, formatDate } from "../utils";
import { ServiceIcon } from "../components/ServiceIcon";

export function HistoryPage() {
  const { payments, isLoading } = usePaymentsCtx();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const filteredPayments = payments.filter((p) => {
    const paymentDate = new Date(p.paidDate);
    const [year, month] = selectedMonth.split("-").map(Number);
    return (
      paymentDate.getFullYear() === year &&
      paymentDate.getMonth() === month - 1
    );
  });

  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="app-container">
        <Header title="Historial" />
        <div className="page-content">
          <p>Cargando...</p>
        </div>
        <BottomTabs />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header title="Historial" />
      <div className="page-content">
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Filtrar por mes</label>
            <input
              type="month"
              className="input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {filteredPayments.length > 0 && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="summary-row">
              <span className="summary-label">Total del mes</span>
              <span className="summary-value paid">
                {formatCurrency(totalPaid)}
              </span>
            </div>
            <div className="summary-row" style={{ marginTop: 8 }}>
              <span className="summary-label">Pagos realizados</span>
              <span className="summary-value">{filteredPayments.length}</span>
            </div>
          </div>
        )}

        {filteredPayments.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Sin pagos"
            text="No hay pagos registrados para este mes"
          />
        ) : (
          <div className="card" style={{ padding: 0 }}>
            {filteredPayments.map((payment) => (
              <PaymentItem key={payment.id} payment={payment} />
            ))}
          </div>
        )}
      </div>
      <BottomTabs />
    </div>
  );
}

function PaymentItem({ payment }: { payment: Payment }) {
  return (
    <div className="list-item" style={{ padding: "14px 16px" }}>
      <ServiceIcon type={payment.serviceType} size={40} />
      <div className="list-item-content">
        <div className="list-item-title">{payment.serviceName}</div>
        <div className="list-item-subtitle">
          {formatDate(payment.paidDate)} · {payment.paidBy}
        </div>
      </div>
      <div className="list-item-action">
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--paid)",
          }}
        >
          {formatCurrency(payment.amount)}
        </span>
      </div>
    </div>
  );
}