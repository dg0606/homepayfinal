import { Service, FilterStatus } from "../models";
import { ServiceIcon } from "./ServiceIcon";
import { formatCurrency, formatDate, isOverdue } from "../utils";

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const overdue = isOverdue(service.dueDate, service.isPaid);

  let statusClass = "status-paid";
  let statusText = "Pagado";

  if (!service.isPaid) {
    if (overdue) {
      statusClass = "status-overdue";
      statusText = "Atrasado";
    } else {
      statusClass = "status-pending";
      statusText = "Pendiente";
    }
  }

  return (
    <div className="card service-card" onClick={() => onPress(service)}>
      <ServiceIcon type={service.type} />
      <div className="service-info">
        <div className="service-name">{service.name}</div>
        <div className="service-due">
          Vence: {formatDate(service.dueDate)}
          {service.paidBy && <span> · Pagado por {service.paidBy}</span>}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="service-amount">{formatCurrency(service.amount)}</div>
        <span className={`service-status ${statusClass}`}>{statusText}</span>
      </div>
    </div>
  );
}

interface ServiceCardListProps {
  services: Service[];
  filter: FilterStatus;
  onServicePress: (service: Service) => void;
}

export function ServiceCardList({
  services,
  filter,
  onServicePress,
}: ServiceCardListProps) {
  const filtered = services.filter((s) => {
    const overdue = isOverdue(s.dueDate, s.isPaid);
    switch (filter) {
      case "pendientes":
        return !s.isPaid && !overdue;
      case "pagados":
        return s.isPaid;
      case "atrasados":
        return !s.isPaid && overdue;
      default:
        return true;
    }
  });

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <div className="empty-state-title">Sin servicios</div>
        <div className="empty-state-text">
          {filter === "todos"
            ? "Agrega tu primer servicio con el botón +"
            : `No hay servicios ${filter}`}
        </div>
      </div>
    );
  }

  return (
    <div>
      {filtered.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onPress={onServicePress}
        />
      ))}
    </div>
  );
}