import { useState, useEffect } from "react";
import { criterios, classifColor } from "../../constants/pontuacao";
import { API_URL as API } from "../../../../config";

const PONTUACAO_MAX = 290;

const clampTotal = (valor) => Math.min(Math.max(valor ?? 0, 0), PONTUACAO_MAX);

const AbaPontuacao = ({ id }) => {
  const [pont, setPont] = useState(null);
  const [ajuste, setAjuste] = useState(0);
  const [obs, setObs] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/participantes/${id}/pontuacao`)
      .then((r) => r.json())
      .then((data) => {
        setPont({ ...data, pontuacao_total: clampTotal(data.pontuacao_total) });
        setAjuste(data.ajuste_manual ?? 0);
        setObs(data.observacao_ajuste ?? "");
      });
  }, [id]);

  const salvar = async () => {
    setSalvando(true);
    const res = await fetch(`${API}/api/participantes/${id}/pontuacao`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ajuste_manual: Number(ajuste),
        observacao_ajuste: obs,
      }),
    });
    const data = await res.json();
    setPont((prev) => ({
      ...prev,
      pontuacao_total: clampTotal(data.pontuacao_total),
      classificacao: data.classificacao,
      ajuste_manual: Number(ajuste),
    }));
    setSalvando(false);
  };

  if (!pont) return <div className="loading">Calculando pontuação...</div>;

  const subtotal = criterios.reduce((acc, c) => acc + (pont[c.key] ?? 0), 0);
  const total = pont.pontuacao_total;
  const classif = pont.classificacao;

  return (
    <div className="aba-pontuacao">
      <div className="pont-resumo">
        <div className="pont-total">
          <span className="pont-total-num">{total}</span>
          <span className="pont-total-label">/ 290 pontos</span>
        </div>
        <div
          className="pont-classif"
          style={{ color: classifColor[classif] ?? "#64748b" }}
        >
          {classif}
        </div>
        <div className="pont-barra-wrap">
          <div
            className="pont-barra"
            style={{ width: `${Math.min((total / 290) * 100, 100)}%` }}
          />
        </div>
        <div className="pont-faixas">
          <span>0</span>
          <span style={{ color: "#a16207" }}>73</span>
          <span style={{ color: "#1d4ed8" }}>146</span>
          <span style={{ color: "#15803d" }}>219</span>
          <span>290</span>
        </div>
      </div>

      <div className="pont-criterios">
        {criterios.map((c) => {
          const val = pont[c.key] ?? 0;
          const pct = (val / c.max) * 100;
          return (
            <div key={c.key} className="pont-item">
              <div className="pont-item-header">
                <span className="pont-item-label">{c.label}</span>
                <span
                  className={`pont-item-val ${val > 0 ? "val-positivo" : "val-zero"}`}
                >
                  {val}/{c.max}
                </span>
              </div>
              <div className="pont-item-barra-wrap">
                <div
                  className="pont-item-barra"
                  style={{
                    width: `${pct}%`,
                    background: val > 0 ? "#6366f1" : "#e2e8f0",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pont-ajuste">
        <div className="pont-ajuste-titulo">Ajuste manual do analista</div>
        <div className="pont-ajuste-row">
          <div className="campo-group">
            <label className="campo-label">Pontos de ajuste</label>
            <input
              type="number"
              className="pont-input"
              value={ajuste}
              onChange={(e) => setAjuste(e.target.value)}
              placeholder="ex: -10 ou +20"
            />
          </div>
          <div className="campo-group" style={{ flex: 2 }}>
            <label className="campo-label">Observação</label>
            <input
              type="text"
              className="pont-input"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Motivo do ajuste..."
            />
          </div>
          <button
            className="btn-salvar"
            onClick={salvar}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar ajuste"}
          </button>
        </div>
        {pont.ajuste_manual !== 0 && (
          <div className="pont-ajuste-info">
            Subtotal automático: {subtotal} pts + ajuste:{" "}
            {pont.ajuste_manual > 0 ? "+" : ""}
            {pont.ajuste_manual} pts = <strong>{total} pts</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbaPontuacao;