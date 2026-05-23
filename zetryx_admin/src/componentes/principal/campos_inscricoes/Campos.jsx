import { useState } from "react";
import "./style.css";

const proximoStatus = { Novo: "Revisando", Revisando: "Finalizado", Finalizado: "Finalizado" };
const tagClass = { Novo: "tag-novo", Revisando: "tag-rev", Finalizado: "tag-fin" };
const tagDot = { Novo: "🟢", Revisando: "🟡", Finalizado: "🔵" };

const Tabela = ({ dados, setDados, onEntrar }) => {
    const avancar = async (idx) => {
        const d = dados[idx];
        const novoStatus = proximoStatus[d.status];
        await fetch(`http://localhost:5000/api/participantes/${d.id_participante}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus }),
        });
        setDados(prev => prev.map((item, i) =>
            i === idx ? { ...item, status: novoStatus } : item
        ));
    };

    return (
        <div className="tabela-card">
            <div className="tabela-header">
                <span className="tabela-th">Nome / Matrícula</span>
                <span className="tabela-th">Status</span>
                <span className="tabela-th">Modalidade</span>
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
                        <div className="tabela-row" key={d.id_participante}>
                            <div className="tabela-cell tabela-cell-name">
                                <span>{d.nome_completo}</span>
                                <span className="tabela-cell-sub">{d.matricula}</span>
                            </div>
                            <div className="tabela-cell">
                                <span className={`tabela-tag ${tagClass[d.status]}`}>
                                    {tagDot[d.status]} {d.status}
                                </span>
                            </div>
                            <div className="tabela-cell tabela-cell-muted">{d.modalidade_auxilio}</div>
                            <div className="tabela-cell tabela-cell-center">
                                <button
                                    className="tabela-action-btn"
                                    onClick={() => onEntrar(d.id_participante)}
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