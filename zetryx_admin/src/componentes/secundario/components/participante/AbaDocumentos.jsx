import { useState, useEffect } from "react";
import Secao from "../ui/Secao";
import { API_URL as API } from "../../../../config";

const AbaDocumentos = ({ documentos = [], participanteId }) => {
  const [validacoes, setValidacoes] = useState({});
  const [salvando, setSalvando] = useState({});
  const [salvos, setSalvos] = useState({});
  const [imagemAmpliada, setImagemAmpliada] = useState(null); // { url, titulo }

  useEffect(() => {
    if (!documentos.length) return;
    const inicial = {};
    documentos.forEach((d) => {
      const docId = d.id_pdf ?? d.id;
      if (docId == null) return;
      inicial[docId] = {
        status: d.status ?? d.status_validacao ?? "",
        justificativa: d.justificativa ?? "",
      };
    });
    setValidacoes(inicial);
    setSalvos({});
  }, [documentos]);

  const handleStatusChange = (id, status) => {
    setValidacoes((prev) => ({ ...prev, [id]: { ...prev[id], status } }));
    setSalvos((prev) => ({ ...prev, [id]: false }));
  };

  const handleJustificativaChange = (id, texto) => {
    setValidacoes((prev) => ({ ...prev, [id]: { ...prev[id], justificativa: texto } }));
  };

  const salvarValidacao = async (id) => {
    const resultado = validacoes[id];
    if (!resultado?.status) return;
    setSalvando((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${API}/api/documentos/${id}/validacao`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: resultado.status,
          justificativa: resultado.justificativa ?? "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSalvos((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error("Erro ao salvar validação:", err);
    } finally {
      setSalvando((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      {/* Modal de imagem ampliada */}
      {imagemAmpliada && (
        <div
          onClick={() => setImagemAmpliada(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
            padding: "24px",
          }}
        >
          <img
            src={imagemAmpliada.url}
            alt={imagemAmpliada.titulo}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
              cursor: "default",
            }}
          />
          <span style={{ color: "#cbd5e1", marginTop: "12px", fontSize: "14px" }}>
            {imagemAmpliada.titulo}
          </span>
          <button
            onClick={() => setImagemAmpliada(null)}
            style={{
              position: "absolute",
              top: "16px",
              right: "20px",
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      <Secao titulo="Documentos Anexados">
        {documentos.length === 0 ? (
          <p className="vazio">Nenhum documento anexado.</p>
        ) : (
          <div className="docs-grid">
            {documentos.map((d, i) => {
              const docId = d.id_pdf ?? d.id ?? i;
              const statusAtual = validacoes[docId]?.status;
              const foiSalvo = salvos[docId];
              const estaSalvando = salvando[docId];

              // Extrai só o nome do arquivo e monta a URL correta do Flask
              const nomeArquivo = (d.url || '').split('/').pop();
              const urlFinal = nomeArquivo ? `${API}/uploads/${nomeArquivo}` : null;

              return (
                <div key={docId} className="doc-card-analise">
                  {urlFinal ? (
                    <img
                      src={urlFinal}
                      alt={d.titulo_do_pdf}
                      className="doc-preview"
                      onClick={() => setImagemAmpliada({ url: urlFinal, titulo: d.titulo_do_pdf })}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                      style={{ cursor: "zoom-in" }}
                    />
                  ) : (
                    <div className="doc-sem-preview">📄</div>
                  )}

                  <span className="doc-nome">{d.titulo_do_pdf}</span>

                  <div className="doc-acoes">
                    <button
                      type="button"
                      className={`btn-status btn-aprovar ${statusAtual === "aprovado" ? "ativo" : ""}`}
                      onClick={() => handleStatusChange(docId, "aprovado")}
                    >
                      ✓ Aprovado
                    </button>
                    <button
                      type="button"
                      className={`btn-status btn-recusar ${statusAtual === "recusado" ? "ativo" : ""}`}
                      onClick={() => handleStatusChange(docId, "recusado")}
                    >
                      ✕ Recusado
                    </button>
                  </div>

                  {statusAtual === "recusado" && (
                    <div className="doc-justificativa">
                      <label htmlFor={`just-${docId}`}>Motivo da rejeição:</label>
                      <textarea
                        id={`just-${docId}`}
                        placeholder="Informe o motivo pelo qual o documento foi recusado..."
                        value={validacoes[docId]?.justificativa ?? ""}
                        onChange={(e) => handleJustificativaChange(docId, e.target.value)}
                      />
                    </div>
                  )}

                  {statusAtual && (
                    <button
                      type="button"
                      className={`btn-enviar-analise ${foiSalvo ? "salvo" : ""}`}
                      onClick={() => salvarValidacao(docId)}
                      disabled={estaSalvando || foiSalvo}
                    >
                      {estaSalvando ? "Salvando..." : foiSalvo ? "✓ Avaliação salva" : "Confirmar avaliação"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Secao>
    </>
  );
};

export default AbaDocumentos;