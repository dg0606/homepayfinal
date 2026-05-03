import { NavLink, useLocation } from "react-router-dom";

interface TabItem {
  path: string;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { path: "/", label: "Inicio", icon: "🏠" },
  { path: "/history", label: "Historial", icon: "📋" },
  { path: "/stats", label: "Estadísticas", icon: "📊" },
  { path: "/settings", label: "Config", icon: "⚙️" },
];

export function BottomTabs() {
  const location = useLocation();

  return (
    <nav className="bottom-tabs">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `tab-item ${isActive || (tab.path === "/" && location.pathname === "/") ? "active" : ""}`
          }
          end={tab.path === "/"}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}