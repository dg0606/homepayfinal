import { FilterStatus } from "../models";

interface FilterChipsProps {
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

const filters: { key: FilterStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "pendientes", label: "Pendientes" },
  { key: "pagados", label: "Pagados" },
  { key: "atrasados", label: "Atrasados" },
];

export function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <div className="chip-group">
      {filters.map((f) => (
        <button
          key={f.key}
          className={`chip ${activeFilter === f.key ? "active" : ""}`}
          onClick={() => onFilterChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}