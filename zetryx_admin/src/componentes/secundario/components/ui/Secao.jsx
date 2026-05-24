import { useState } from "react";
 
const Secao = ({ titulo, children, colapsavel = true }) => {
  const [aberta, setAberta] = useState(true);
 
  return (
    <div className="secao">
      <div
        className="secao-header"
        onClick={() => colapsavel && setAberta((a) => !a)}
      >
        <span className="secao-titulo">{titulo}</span>
        {colapsavel && (
          <span className="secao-chevron">{aberta ? "▲" : "▼"}</span>
        )}
      </div>
      {aberta && <div className="secao-corpo">{children}</div>}
    </div>
  );
};
 
export default Secao;