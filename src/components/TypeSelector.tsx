import { ServiceType } from "../models";
import { SERVICE_LABELS } from "../utils";
import { ServiceIcon } from "./ServiceIcon";

interface TypeSelectorProps {
  selected: ServiceType | null;
  onSelect: (type: ServiceType) => void;
}

const types: ServiceType[] = ["agua", "luz", "gas", "internet", "telefono", "otro"];

export function TypeSelector({ selected, onSelect }: TypeSelectorProps) {
  return (
    <div className="type-selector">
      {types.map((type) => (
        <button
          key={type}
          type="button"
          className={`type-option ${selected === type ? "selected" : ""}`}
          onClick={() => onSelect(type)}
        >
          <ServiceIcon type={type} size={48} />
          <span className="type-option-label">{SERVICE_LABELS[type]}</span>
        </button>
      ))}
    </div>
  );
}