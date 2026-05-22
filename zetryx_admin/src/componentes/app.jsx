import Sidebar from "./principal/painel/Painel";
import Toolbar from "./principal/barradeferramentas/BarradeFerramentas";
import Tabela from "./principal/campos_inscricoes/campos";

const App = () => (
  <div style={{ display: "flex", height: "100vh" }}>
    <Sidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 28px", gap: "18px" }}>
      <Toolbar />
      <Tabela />
    </div>
  </div>
);
export default App;