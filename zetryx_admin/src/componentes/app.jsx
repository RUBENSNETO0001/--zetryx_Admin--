import Sidebar from "./principal/painel/Painel";
import Toolbar from "./principal/barradeferramentas/BarradeFerramentas";
import Tabela from "./principal/campos_inscricoes/Campos";
import PaginaParticipante from "./secundario/barradeferramentas/BarradeF";
import { useState, useEffect } from "react";

const App = () => {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [participanteSelecionado, setParticipanteSelecionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/participantes")
      .then(r => r.json())
      .then(setDados)
      .catch(err => console.error("Erro ao buscar participantes:", err));
  }, []);

  const contagens = {
    Todos: dados.length,
    Novo: dados.filter(d => d.status === "Novo").length,
    Revisando: dados.filter(d => d.status === "Revisando").length,
    Finalizado: dados.filter(d => d.status === "Finalizado").length,
  };

  const dadosFiltrados = dados.filter(d => {
    const passaFiltro = filtro === "Todos" || d.status === filtro;
    const passaBusca = d.nome_completo.toLowerCase().includes(busca.toLowerCase());
    return passaFiltro && passaBusca;
  });

  // Se tem participante selecionado, mostra a página dele
  if (participanteSelecionado) {
    return (
      <PaginaParticipante
        id={participanteSelecionado}
        onVoltar={() => setParticipanteSelecionado(null)}
      />
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar ativo={filtro} setAtivo={setFiltro} contagens={contagens} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Toolbar onBusca={setBusca} onExportar={() => {}} />
        <Tabela
          dados={dadosFiltrados}
          setDados={setDados}
          onEntrar={(id) => setParticipanteSelecionado(id)}
        />
      </div>
    </div>
  );
};

export default App;