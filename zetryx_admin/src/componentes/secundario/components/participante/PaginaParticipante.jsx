import { useState, useEffect } from "react";
import AbaDados from "./AbaDados";
import AbaPontuacao from "./AbaPontuacao";
import "../../style/style.css";
const API = "http://localhost:5000";
 
const PaginaParticipante = ({ id, onVoltar }) => {
  const [aba, setAba] = useState("dados");
  const [dados, setDados] = useState(null);
  const [status, setStatus] = useState("");
 
  useEffect(() => {
    fetch(`${API}/api/participantes/${id}/completo`)
      .then((r) => r.json())
      .then((data) => {
        setDados(data);
        setStatus(data.participante?.status ?? "Novo");
      });
  }, [id]);
 
  const atualizarStatus = async (novoStatus) => {
    await fetch(`${API}/api/participantes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    setStatus(novoStatus);
  };
 
  return (
    <div className="pagina-participante">
      <div className="pp-header">
        <button className="btn-voltar" onClick={onVoltar}>
          ← Voltar
        </button>
        <div className="pp-header-info">
          <span className="pp-nome">
            {dados?.participante?.nome_completo ?? "..."}
          </span>
          <span className="pp-email">{dados?.participante?.email ?? ""}</span>
        </div>
        <div className="pp-header-acoes">
          <button
            className="btn-reavaliar"
            onClick={() => atualizarStatus("Revisando")}
            disabled={status === "Novo"}
          >
            Re-avaliar
          </button>
          <button
            className="btn-finalizar"
            onClick={() => atualizarStatus("Finalizado")}
            disabled={status === "Finalizado"}
          >
            Finalizar
          </button>
        </div>
      </div>
 
      <div className="pp-abas">
        <button
          className={`pp-aba ${aba === "dados" ? "ativa" : ""}`}
          onClick={() => setAba("dados")}
        >
          Dados do participante
        </button>
        <button
          className={`pp-aba ${aba === "pontuacao" ? "ativa" : ""}`}
          onClick={() => setAba("pontuacao")}
        >
          Pontuação
        </button>
      </div>
 
      <div className="pp-conteudo">
        {aba === "dados" && <AbaDados dados={dados} />}
        {aba === "pontuacao" && <AbaPontuacao id={id} />}
      </div>
    </div>
  );
};
 
export default PaginaParticipante;