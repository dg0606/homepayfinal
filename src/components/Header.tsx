import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightContent?: ReactNode;
}

export function Header({ title, onBack, rightContent }: HeaderProps) {
  return (
    <div className="header">
      {onBack ? (
        <button className="back-button" onClick={onBack} aria-label="Volver">
          ←
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      <h1 style={{ flex: 1, textAlign: "center" }}>{title}</h1>
      {rightContent ? (
        <div style={{ minWidth: 40 }}>{rightContent}</div>
      ) : (
        <div style={{ width: 40 }} />
      )}
    </div>
  );
}