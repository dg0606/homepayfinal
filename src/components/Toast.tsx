import { useToast } from "../hooks/useToast";

export function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(90px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 9999,
        maxWidth: "90vw",
        width: "320px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            background:
              toast.type === "success"
                ? "var(--secondary)"
                : toast.type === "error"
                ? "var(--error)"
                : "var(--primary)",
            color: "white",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            cursor: "pointer",
            textAlign: "center",
            animation: "slideUp 0.3s ease",
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}