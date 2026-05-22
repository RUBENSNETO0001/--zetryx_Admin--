import { useState } from "react";
import "./style.css";

//substituir para o banco
const dadosIniciais = [
    { nome: "Ana Souza", form: "Bolsa Cultural 2025", status: "Novo", data: "15/05/2025", analista: "Carlos M." },
    { nome: "Bruno Lima", form: "Cadastro Artesão", status: "Revisando", data: "10/05/2025", analista: "Maria J." },
    { nome: "Carla Nunes", form: "Auxílio Moradia", status: "Finalizado", data: "03/05/2025", analista: "João P." },
    { nome: "Diego Rocha", form: "Bolsa Cultural 2025", status: "Novo", data: "18/05/2025", analista: "Carlos M." },
    { nome: "Elena Freitas", form: "Formação Técnica", status: "Revisando", data: "08/05/2025", analista: "Ana R." },
    { nome: "Fábio Castro", form: "Auxílio Moradia", status: "Finalizado", data: "01/05/2025", analista: "João P." },
    { nome: "Gisele Torres", form: "Cadastro Artesão", status: "Novo", data: "20/05/2025", analista: "Maria J." },
];

const proximoStatus = { Novo: "Revisando", Revisando: "Finalizado", Finalizado: "Finalizado" };

const tagClass = { Novo: "tag-novo", Revisando: "tag-rev", Finalizado: "tag-fin" };
const tagDot = { Novo: "🟢", Revisando: "🟡", Finalizado: "🔵" };

const Tabela = () => {
    const [dados, setDados] = useState(dadosIniciais);
    // substituir por logica para entar em uma campo de um aluno
    const analisar = (idx) => {
        setDados((prev) =>
            prev.map((d, i) =>
                i === idx ? { ...d, status: proximoStatus[d.status] } : d
            )
        );
    };

    return (
        <div className="tabela-card">
            <div className="tabela-header">
                <span className="tabela-th">Nome / Formulário</span>
                <span className="tabela-th">Status</span>
                <span className="tabela-th">Inscrição</span>
                <span className="tabela-th">Analista</span>
                <span className="tabela-th tabela-th-center">Ação</span>
            </div>

            <div className="tabela-body">
                {dados.length === 0 ? (
                    <div className="tabela-empty">
                        <span className="tabela-empty-icon">📭</span>
                        <span>Nenhum registro encontrado.</span>
                    </div>
                ) : (
                    dados.map((d, i) => (
                        <div className="tabela-row" key={i}>
                            <div className="tabela-cell tabela-cell-name">
                                <span>{d.nome}</span>
                                <span className="tabela-cell-sub">{d.form}</span>
                            </div>
                            <div className="tabela-cell">
                                <span className={`tabela-tag ${tagClass[d.status]}`}>
                                    {tagDot[d.status]} {d.status}
                                </span>
                            </div>
                            <div className="tabela-cell tabela-cell-muted">{d.data}</div>
                            <div className="tabela-cell tabela-cell-muted">{d.analista}</div>
                            <div className="tabela-cell tabela-cell-center">
                                <button
                                    className="tabela-action-btn"
                                    onClick={() => analisar(i)}
                                    disabled={d.status === "Finalizado"}
                                >
                                    Entrar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tabela;