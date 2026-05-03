import { ServiceType } from "../models";

interface ServiceIconProps {
  type: ServiceType;
  size?: number;
}

const icons: Record<ServiceType, string> = {
  agua: "💧",
  luz: "⚡",
  gas: "🔥",
  internet: "📶",
  telefono: "📱",
  otro: "➕",
};

const bgColors: Record<ServiceType, string> = {
  agua: "#E3F2FD",
  luz: "#FFF8E1",
  gas: "#FBE9E7",
  internet: "#E8F5E9",
  telefono: "#F3E5F5",
  otro: "#ECEFF1",
};

export function ServiceIcon({ type, size = 44 }: ServiceIconProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: bgColors[type],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {icons[type]}
    </div>
  );
}

export function getServiceIconEmoji(type: ServiceType): string {
  return icons[type];
}