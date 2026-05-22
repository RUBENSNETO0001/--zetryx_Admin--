import { useState } from "react";
import "./style.css";

const Painel = () => {
  const [ativo, setAtivo] = useState("Todos");

  const itens = [
    { label: "Todos", icon: "☰"},
    { label: "Novo", dot: "novo" },
    { label: "Revisando", dot: "rev"},
    { label: "Finalizado", dot: "fin"},
  ];

  const dotColor = {
    novo: "#56ab91",
    rev: "#f4c261",
    fin: "#7ea8f5",
  };

  return (
    <>
      <div className="sb-root">
        <div className="sb-header">
          <div className="sb-title">Zetryx</div>
          <div className="sb-subtitle">Formulários</div>
        </div>

        <div className="sb-label">Status</div>

        {itens.map((item) => (
          <button
            key={item.label}
            className={`sb-item ${ativo === item.label ? "active" : ""}`}
            onClick={() => setAtivo(item.label)}
          >
            {item.icon ? (
              <span style={{ fontSize: 15 }}>{item.icon}</span>
            ) : (
              <span
                className="sb-dot"
                style={{ background: dotColor[item.dot] }}
              />
            )}
            {item.label}
            <span className="sb-badge">{item.badge}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Painel;