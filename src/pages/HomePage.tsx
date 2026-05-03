import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, FilterChips, ServiceCardList, BottomTabs } from "../components";
import { useServicesCtx } from "../hooks";
import { FilterStatus } from "../models";
import { formatCurrency } from "../utils";

export function HomePage() {
  const navigate = useNavigate();
  const { services, isLoading } = useServicesCtx();
  const [filter, setFilter] = useState<FilterStatus>("todos");

  const pendingTotal = services
    .filter((s) => !s.isPaid)
    .reduce((sum, s) => sum + s.amount, 0);

  const paidTotal = services
    .filter((s) => s.isPaid)
    .reduce((sum, s) => sum + s.amount, 0);

  if (isLoading) {
    return (
      <div className="app-container">
        <Header title="HomePay" />
        <div className="page-content">
          <p>Cargando...</p>
        </div>
        <BottomTabs />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header title="HomePay" />
      <div className="page-content">
        <div className="card summary-card" style={{ marginBottom: 16 }}>
          <div className="summary-row">
            <span className="summary-label">Total pendiente</span>
            <span className="summary-value pending">
              {formatCurrency(pendingTotal)}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Total pagado</span>
            <span className="summary-value paid">
              {formatCurrency(paidTotal)}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Servicios</span>
            <span className="summary-value">{services.length}</span>
          </div>
        </div>

        <FilterChips activeFilter={filter} onFilterChange={setFilter} />

        <ServiceCardList
          services={services}
          filter={filter}
          onServicePress={(service) =>
            navigate(`/service/${service.id}`, { state: { service } })
          }
        />
      </div>

      <button className="fab" onClick={() => navigate("/add-service")}>
        +
      </button>

      <BottomTabs />
    </div>
  );
}