import Sidebar from "./principal/painel/Painel";
import Toolbar from "./principal/barradeferramentas/BarradeFerramentas";
import Tabela from "./principal/campos_inscricoes/Campos";
import { useState, useEffect } from "react";
import PaginaParticipante from "./secundario/components/participante/PaginaParticipante";


const App = () => {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [participanteSelecionado, setParticipanteSelecionado] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://zetryxadmin-production.up.railway.app';


  useEffect(() => {
    fetch(`${API_URL}/api/participantes`)
      .then(res => res.json())
      .then(data => console.log(data))
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
        <Toolbar onBusca={setBusca} onExportar={() => { }} />
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