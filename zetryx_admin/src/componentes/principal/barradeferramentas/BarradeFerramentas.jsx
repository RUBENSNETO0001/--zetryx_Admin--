import "./style.css";

const Barradeferramentas = ({ onExportar, onBusca }) => {
  return (
    <div className="toolbar-root">
      <button className="toolbar-btn toolbar-btn-outline" onClick={onExportar}>
        ⬇ Exportar
      </button>
    </div>
  );
};

export default Barradeferramentas;