import "./style.css";
const Barradeferramentas = ({ onExportar, onNovo }) => {
  const hoje = new Date().toLocaleDateString("pt-BR");
 
  return (
    <div className="toolbar-root">
      <div className="toolbar-search-wrap">
        <span className="toolbar-search-icon">🔍</span>
        <input
          className="toolbar-search-input"
          type="text"
          placeholder="Nome do inscrito ou formulário..."
        />
      </div>
 
      <div className="toolbar-date-badge">
        📅 {hoje}
      </div>
 
      <button className="toolbar-btn toolbar-btn-outline" onClick={onExportar}>
        ⬇ Exportar
      </button>
    </div>
  );
};
 
export default Barradeferramentas ;