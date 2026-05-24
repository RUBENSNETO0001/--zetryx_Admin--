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

export default Campo;