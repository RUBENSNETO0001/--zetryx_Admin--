import { useState, useEffect } from "react";
import "./style.css";

const API = "http://localhost:5000";

const Secao = ({ titulo, children, colapsavel = true }) => {
  const [aberta, setAberta] = useState(true);
  return (
    <div className="secao">
      <div className="secao-header" onClick={() => colapsavel && setAberta(a => !a)}>
        <span className="secao-titulo">{titulo}</span>
        {colapsavel && <span className="secao-chevron">{aberta ? "▲" : "▼"}</span>}
      </div>
      {aberta && <div className="secao-corpo">{children}</div>}
    </div>
  );
};

const Campo = ({ label, valor, pontos }) => (
  <div className="campo">
    <span className="campo-label">{label}</span>
    <span className="campo-valor">{valor ?? "—"}</span>
    {pontos !== undefined && (
      <span className={`campo-pontos ${pontos > 0 ? "pontos-positivo" : "pontos-zero"}`}>
        {pontos > 0 ? `+${pontos} pts` : "0 pts"}
      </span>
    )}
  </div>
);

// ── ABA DADOS ────────────────────────────────────────────────
const AbaDados = ({ dados }) => {
  if (!dados) return <div className="loading">Carregando dados...</div>;
  const {
    participante, endereco, curso, matricula,
    socioeconomico, beneficios, membros,
    bancario, declaracoes, documentos
  } = dados;

  return (
    <div className="aba-dados">
      <Secao titulo="Dados Pessoais">
        <div className="grid-4">
          <Campo label="Nome completo" valor={participante?.nome_completo} />
          <Campo label="CPF" valor={participante?.cpf} />
          <Campo label="Matrícula" valor={participante?.matricula} />
          <Campo label="Data de nascimento" valor={participante?.data_nascimento} />
          <Campo label="E-mail" valor={participante?.email} />
          <Campo label="Telefone" valor={participante?.telefone} />
          <Campo label="Estado civil" valor={participante?.estado_civil} />
          <Campo label="Modalidade" valor={participante?.modalidade_auxilio} />
        </div>
      </Secao>

      <Secao titulo="Endereço">
        <div className="grid-4">
          <Campo label="Rua" valor={endereco?.rua} />
          <Campo label="Número" valor={endereco?.numero} />
          <Campo label="Bairro" valor={endereco?.bairro} />
          <Campo label="Cidade" valor={endereco?.cidade} />
          <Campo label="CEP" valor={endereco?.cep} />
          <Campo label="Complemento" valor={endereco?.complemento} />
          <Campo label="Ponto de referência" valor={endereco?.ponto_referencia} />
        </div>
      </Secao>

      <Secao titulo="Curso e Matrícula">
        <div className="grid-4">
          <Campo label="Nome do curso" valor={curso?.nome_curso} />
          <Campo label="Tipo" valor={curso?.tipo_curso} />
          <Campo label="Data de matrícula" valor={matricula?.data_matricula} />
          <Campo label="Disciplinas matriculadas" valor={matricula?.qtd_disciplinas_matriculadas} />
        </div>
      </Secao>

      <Secao titulo="Dados Socioeconômicos">
        <div className="grid-4">
          <Campo label="Tipo de moradia" valor={socioeconomico?.tipo_moradia} />
          <Campo label="Mora em" valor={socioeconomico?.mora_em} />
          <Campo label="Renda bruta familiar" valor={socioeconomico?.renda_bruta_total_familiar ? `R$ ${parseFloat(socioeconomico.renda_bruta_total_familiar).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : null} />
          <Campo label="Pessoas na casa" valor={socioeconomico?.quantidade_pessoas_casa} />
        </div>
      </Secao>

      <Secao titulo="Benefícios">
        <div className="grid-4">
          <Campo label="Recebe auxílio/bolsa" valor={beneficios?.recebe_auxilio_bolsa ? "Sim" : "Não"} />
          <Campo label="Nome do benefício" valor={beneficios?.nome_beneficio} />
          <Campo label="Bolsa Família / CadÚnico" valor={beneficios?.beneficiario_bolsa_familia_cadunico ? "Sim" : "Não"} />
          <Campo label="Recebe BPC" valor={beneficios?.recebe_bpc ? "Sim" : "Não"} />
        </div>
      </Secao>

      <Secao titulo="Declarações">
        <div className="grid-4">
          <Campo label="Lei de cotas" valor={declaracoes?.lei_cotas ? "Sim" : "Não"} />
          <Campo label="Possui deficiência" valor={declaracoes?.possui_deficiencia ? "Sim" : "Não"} />
          <Campo label="Origem quilombola" valor={declaracoes?.origem_quilombola ? "Sim" : "Não"} />
          <Campo label="Estrangeiro" valor={declaracoes?.estrangeiro ? "Sim" : "Não"} />
        </div>
      </Secao>

      <Secao titulo="Membros da Família">
        {membros?.length === 0 ? (
          <p className="vazio">Nenhum membro cadastrado.</p>
        ) : (
          membros?.map((m, i) => (
            <div key={i} className="membro-card">
              <div className="membro-titulo">{m.nome} — {m.parentesco}</div>
              <div className="grid-4">
                <Campo label="Data de nascimento" valor={m.data_nascimento} />
                <Campo label="Profissão" valor={m.profissao} />
                <Campo label="Vínculo empregatício" valor={m.vinculo_empregaticio} />
                <Campo label="Renda mensal" valor={m.renda_mensal ? `R$ ${parseFloat(m.renda_mensal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : null} />
                <Campo label="Possui deficiência" valor={m.possui_deficiencia ? "Sim" : "Não"} />
                <Campo label="Possui doença crônica" valor={m.possui_doenca_cronica ? "Sim" : "Não"} />
              </div>
            </div>
          ))
        )}
      </Secao>

      <Secao titulo="Dados Bancários">
        <div className="grid-4">
          <Campo label="Banco" valor={bancario?.nome_instituicao} />
          <Campo label="Possui conta" valor={bancario?.possui_conta ? "Sim" : "Não"} />
          <Campo label="Tipo de conta" valor={bancario?.tipo_conta} />
          <Campo label="Agência" valor={bancario?.agencia} />
          <Campo label="Número da conta" valor={bancario?.numero_conta} />
          <Campo label="Variação poupança" valor={bancario?.variacao_poupanca} />
        </div>
      </Secao>

      <Secao titulo="Documentos Anexados">
        {documentos?.length === 0 ? (
          <p className="vazio">Nenhum documento anexado.</p>
        ) : (
          <div className="docs-grid">
            {documentos?.map((d, i) => (
              <div key={i} className="doc-card">
                <span className="doc-icone">📄</span>
                <span className="doc-nome">{d.titulo_do_pdf}</span>
              </div>
            ))}
          </div>
        )}
      </Secao>
    </div>
  );
};

// ── ABA PONTUAÇÃO ────────────────────────────────────────────
const criterios = [
  { key: "pts_renda", label: "Renda per capita", max: 40 },
  { key: "pts_escolaridade", label: "Escola pública / bolsista integral", max: 40 },
  { key: "pts_lei_cotas", label: "Lei de cotas (Lei nº 12.711)", max: 40 },
  { key: "pts_deficiencia_participante", label: "Estudante com deficiência", max: 40 },
  { key: "pts_quilombola", label: "Quilombola / indígena / comunidade tradicional", max: 40 },
  { key: "pts_estrangeiro", label: "Estrangeiro em vulnerabilidade", max: 40 },
  { key: "pts_aluguel", label: "Aluguel ou financiamento da casa", max: 10 },
  { key: "pts_doenca_cronica_familia", label: "Familiar com doença crônica grave", max: 10 },
  { key: "pts_deficiencia_familia", label: "Familiar com deficiência", max: 10 },
  { key: "pts_beneficio_social", label: "Benefício social (Bolsa Família / BPC)", max: 10 },
  { key: "pts_zona_rural", label: "Reside em zona rural ou município distinto", max: 10 },
];

const classifColor = {
  "Vulnerabilidade I": "#15803d",
  "Vulnerabilidade II": "#1d4ed8",
  "Vulnerabilidade III": "#a16207",
  "Não prioritário": "#dc2626",
};

const AbaPontuacao = ({ id }) => {
  const [pont, setPont] = useState(null);
  const [ajuste, setAjuste] = useState(0);
  const [obs, setObs] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/participantes/${id}/pontuacao`)
      .then(r => r.json())
      .then(data => {
        setPont(data);
        setAjuste(data.ajuste_manual ?? 0);
        setObs(data.observacao_ajuste ?? "");
      });
  }, [id]);

  const salvar = async () => {
    setSalvando(true);
    const res = await fetch(`${API}/api/participantes/${id}/pontuacao`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ajuste_manual: Number(ajuste), observacao_ajuste: obs }),
    });
    const data = await res.json();
    setPont(prev => ({ ...prev, pontuacao_total: data.pontuacao_total, classificacao: data.classificacao, ajuste_manual: Number(ajuste) }));
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
        <div className="pont-classif" style={{ color: classifColor[classif] ?? "#64748b" }}>
          {classif}
        </div>
        <div className="pont-barra-wrap">
          <div className="pont-barra" style={{ width: `${Math.min((total / 290) * 100, 100)}%` }} />
        </div>
        <div className="pont-faixas">
          <span>0</span>
          <span style={{color:"#a16207"}}>73</span>
          <span style={{color:"#1d4ed8"}}>146</span>
          <span style={{color:"#15803d"}}>219</span>
          <span>290</span>
        </div>
      </div>

      <div className="pont-criterios">
        {criterios.map(c => {
          const val = pont[c.key] ?? 0;
          const pct = (val / c.max) * 100;
          return (
            <div key={c.key} className="pont-item">
              <div className="pont-item-header">
                <span className="pont-item-label">{c.label}</span>
                <span className={`pont-item-val ${val > 0 ? "val-positivo" : "val-zero"}`}>
                  {val}/{c.max}
                </span>
              </div>
              <div className="pont-item-barra-wrap">
                <div className="pont-item-barra" style={{ width: `${pct}%`, background: val > 0 ? "#6366f1" : "#e2e8f0" }} />
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
              onChange={e => setAjuste(e.target.value)}
              placeholder="ex: -10 ou +20"
            />
          </div>
          <div className="campo-group" style={{ flex: 2 }}>
            <label className="campo-label">Observação</label>
            <input
              type="text"
              className="pont-input"
              value={obs}
              onChange={e => setObs(e.target.value)}
              placeholder="Motivo do ajuste..."
            />
          </div>
          <button className="btn-salvar" onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar ajuste"}
          </button>
        </div>
        {pont.ajuste_manual !== 0 && (
          <div className="pont-ajuste-info">
            Subtotal automático: {subtotal} pts + ajuste: {pont.ajuste_manual > 0 ? "+" : ""}{pont.ajuste_manual} pts = <strong>{total} pts</strong>
          </div>
        )}
      </div>
    </div>
  );
};

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────
const PaginaParticipante = ({ id, onVoltar }) => {
  const [aba, setAba] = useState("dados");
  const [dados, setDados] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${API}/api/participantes/${id}/completo`)
      .then(r => r.json())
      .then(data => {
        setDados(data);
        setStatus(data.participante?.status ?? "Novo");
      });
  }, [id]);

  const finalizar = async () => {
    await fetch(`${API}/api/participantes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Finalizado" }),
    });
    setStatus("Finalizado");
  };

  const reavaliar = async () => {
    await fetch(`${API}/api/participantes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Revisando" }),
    });
    setStatus("Revisando");
  };

  return (
    <div className="pagina-participante">
      {/* HEADER */}
      <div className="pp-header">
        <button className="btn-voltar" onClick={onVoltar}>← Voltar</button>
        <div className="pp-header-info">
          <span className="pp-nome">{dados?.participante?.nome_completo ?? "..."}</span>
          <span className="pp-email">{dados?.participante?.email ?? ""}</span>
        </div>
        <div className="pp-header-acoes">
          <button className="btn-reavaliar" onClick={reavaliar} disabled={status === "Novo"}>
            Re-avaliar
          </button>
          <button className="btn-finalizar" onClick={finalizar} disabled={status === "Finalizado"}>
            Finalizar
          </button>
        </div>
      </div>

      {/* ABAS */}
      <div className="pp-abas">
        <button className={`pp-aba ${aba === "dados" ? "ativa" : ""}`} onClick={() => setAba("dados")}>
          Dados do participante
        </button>
        <button className={`pp-aba ${aba === "pontuacao" ? "ativa" : ""}`} onClick={() => setAba("pontuacao")}>
          Pontuação
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="pp-conteudo">
        {aba === "dados" && <AbaDados dados={dados} />}
        {aba === "pontuacao" && <AbaPontuacao id={id} />}
      </div>
    </div>
  );
};

export default PaginaParticipante;