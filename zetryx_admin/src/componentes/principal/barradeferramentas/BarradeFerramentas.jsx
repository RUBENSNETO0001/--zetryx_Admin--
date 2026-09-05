import { API_URL } from "../../../config";
import "./style.css";

const Barradeferramentas = ({ onBusca }) => {
  const handleExportar = () => {
    window.open(`${API_URL}/api/participantes/exportar`, "_blank");
  };

  return (
    <div className="toolbar-root">
      <button
        className="toolbar-btn toolbar-btn-outline"
        onClick={handleExportar}
        title="Exportar todos os participantes em Excel"
      >
        ⬇ Exportar
      </button>
    </div>
  );
};

export default Barradeferramentas;