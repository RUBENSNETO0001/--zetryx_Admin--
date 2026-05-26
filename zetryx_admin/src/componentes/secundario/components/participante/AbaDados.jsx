import Campo from "../ui/Campo";
import Secao from "../ui/Secao";
 
const formatarReais = (valor) =>
  valor
    ? `R$ ${parseFloat(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : null;
 
const AbaDados = ({ dados }) => {
  if (!dados) return <div className="loading">Carregando dados...</div>;
 
  const {
    participante,
    endereco,
    curso,
    matricula,
    socioeconomico,
    beneficios,
    membros,
    bancario,
    declaracoes,
    documentos,
  } = dados;
 
  return (
    <div className="aba-dados">
      <Secao titulo="Dados Pessoais">
        <div className="grid-4">
          <Campo label="Nome completo" valor={participante?.nome_completo} />
          <Campo label="CPF" valor={participante?.cpf} />
          <Campo label="Matrícula" valor={participante?.matricula} />
          <Campo label="Data de nascimento" valor={participante?.data_nascimento} />
          <Campo label="E-mail" valor={participante?.email} />
          <Campo label="Telefone" valor={participante?.telefone} />
          <Campo label="Estado civil" valor={participante?.estado_civil} />
          <Campo label="Modalidade" valor={participante?.modalidade_auxilio} />
        </div>
      </Secao>
 
      <Secao titulo="Endereço">
        <div className="grid-4">
          <Campo label="Rua" valor={endereco?.rua} />
          <Campo label="Número" valor={endereco?.numero} />
          <Campo label="Bairro" valor={endereco?.bairro} />
          <Campo label="Cidade" valor={endereco?.cidade} />
          <Campo label="CEP" valor={endereco?.cep} />
          <Campo label="Complemento" valor={endereco?.complemento} />
          <Campo label="Ponto de referência" valor={endereco?.ponto_referencia} />
        </div>
      </Secao>
 
      <Secao titulo="Curso e Matrícula">
        <div className="grid-4">
          <Campo label="Nome do curso" valor={curso?.nome_curso} />
          <Campo label="Tipo" valor={curso?.tipo_curso} />
          <Campo label="Data de matrícula" valor={matricula?.data_matricula} />
          <Campo
            label="Disciplinas matriculadas"
            valor={matricula?.qtd_disciplinas_matriculadas}
          />
        </div>
      </Secao>
 
      <Secao titulo="Dados Socioeconômicos">
        <div className="grid-4">
          <Campo label="Tipo de moradia" valor={socioeconomico?.tipo_moradia} />
          <Campo label="Mora em" valor={socioeconomico?.mora_em} />
          <Campo
            label="Renda bruta familiar"
            valor={formatarReais(socioeconomico?.renda_bruta_total_familiar)}
          />
          <Campo
            label="Pessoas na casa"
            valor={socioeconomico?.quantidade_pessoas_casa}
          />
        </div>
      </Secao>
 
      <Secao titulo="Benefícios">
        <div className="grid-4">
          <Campo
            label="Recebe auxílio/bolsa"
            valor={beneficios?.recebe_auxilio_bolsa ? "Sim" : "Não"}
          />
          <Campo label="Nome do benefício" valor={beneficios?.nome_beneficio} />
          <Campo
            label="Bolsa Família / CadÚnico"
            valor={beneficios?.beneficiario_bolsa_familia_cadunico ? "Sim" : "Não"}
          />
          <Campo
            label="Recebe BPC"
            valor={beneficios?.recebe_bpc ? "Sim" : "Não"}
          />
        </div>
      </Secao>
 
      <Secao titulo="Declarações">
        <div className="grid-4">
          <Campo
            label="Lei de cotas"
            valor={declaracoes?.lei_cotas ? "Sim" : "Não"}
          />
          <Campo
            label="Possui deficiência"
            valor={declaracoes?.possui_deficiencia ? "Sim" : "Não"}
          />
          <Campo
            label="Origem quilombola"
            valor={declaracoes?.origem_quilombola ? "Sim" : "Não"}
          />
          <Campo
            label="Estrangeiro"
            valor={declaracoes?.estrangeiro ? "Sim" : "Não"}
          />
        </div>
      </Secao>
 
      <Secao titulo="Membros da Família">
        {membros?.length === 0 ? (
          <p className="vazio">Nenhum membro cadastrado.</p>
        ) : (
          membros?.map((m, i) => (
            <div key={i} className="membro-card">
              <div className="membro-titulo">
                {m.nome} — {m.parentesco}
              </div>
              <div className="grid-4">
                <Campo label="Data de nascimento" valor={m.data_nascimento} />
                <Campo label="Profissão" valor={m.profissao} />
                <Campo label="Vínculo empregatício" valor={m.vinculo_empregaticio} />
                <Campo label="Renda mensal" valor={formatarReais(m.renda_mensal)} />
                <Campo
                  label="Possui deficiência"
                  valor={m.possui_deficiencia ? "Sim" : "Não"}
                />
                <Campo
                  label="Possui doença crônica"
                  valor={m.possui_doenca_cronica ? "Sim" : "Não"}
                />
              </div>
            </div>
          ))
        )}
      </Secao>
 
      <Secao titulo="Dados Bancários">
        <div className="grid-4">
          <Campo label="Banco" valor={bancario?.nome_instituicao} />
          <Campo
            label="Possui conta"
            valor={bancario?.possui_conta ? "Sim" : "Não"}
          />
          <Campo label="Tipo de conta" valor={bancario?.tipo_conta} />
          <Campo label="Agência" valor={bancario?.agencia} />
          <Campo label="Número da conta" valor={bancario?.numero_conta} />
          <Campo label="Variação poupança" valor={bancario?.variacao_poupanca} />
        </div>
      </Secao>

    </div>
  );
};
 
export default AbaDados;
 