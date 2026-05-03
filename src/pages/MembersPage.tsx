import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, BottomTabs, EmptyState } from "../components";
import { useMembersCtx, useToast } from "../hooks";
import { MEMBER_COLORS } from "../utils";

export function MembersPage() {
  const navigate = useNavigate();
  const { members, addMember, deleteMember } = useMembersCtx();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(MEMBER_COLORS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addMember({ name: newName.trim(), color: newColor });
    setNewName("");
    setNewColor(MEMBER_COLORS[0]);
    setShowForm(false);
    showToast("Miembro agregado", "success");
  };

  const handleDelete = (id: string) => {
    deleteMember(id);
    showToast("Miembro eliminado", "info");
  };

  return (
    <div className="app-container">
      <Header title="Miembros" onBack={() => navigate("/settings")} />
      <div className="page-content">
        {members.length === 0 ? (
          <EmptyState
            icon="👥"
            title="Sin miembros"
            text="Agrega los miembros del hogar para asignar pagos"
          />
        ) : (
          <div className="card" style={{ padding: 0 }}>
            {members.map((member) => (
              <div
                key={member.id}
                className="list-item"
                style={{ padding: "14px 16px" }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: member.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="list-item-content">
                  <div className="list-item-title">{member.name}</div>
                </div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--error)",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(member.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            style={{ marginTop: 16 }}
          >
            + Agregar Miembro
          </button>
        ) : (
          <div className="card" style={{ marginTop: 16 }}>
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              Nuevo Miembro
            </h3>
            <div className="input-group">
              <label className="input-label">Nombre</label>
              <input
                type="text"
                className="input"
                placeholder="Nombre del miembro"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Color</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {MEMBER_COLORS.map((color) => (
                  <button
                    key={color}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: color,
                      border:
                        newColor === color
                          ? "3px solid var(--text-primary)"
                          : "3px solid transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={!newName.trim()}
              >
                Agregar
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomTabs />
    </div>
  );
}