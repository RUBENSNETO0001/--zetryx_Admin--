export const criterios = [
  { key: "pts_renda", label: "Renda per capita", max: 40 },
  { key: "pts_escolaridade", label: "Escola pública / bolsista integral", max: 40 },
  { key: "pts_lei_cotas", label: "Lei de cotas (Lei nº 12.711)", max: 40 },
  { key: "pts_deficiencia_participante", label: "Estudante com deficiência", max: 40 },
  { key: "pts_quilombola", label: "Quilombola / indígena / comunidade tradicional", max: 40 },
  { key: "pts_estrangeiro", label: "Estrangeiro em vulnerabilidade", max: 40 },
  { key: "pts_aluguel", label: "Aluguel ou financiamento da casa", max: 10 },
  { key: "pts_doenca_cronica_familia", label: "Familiar com doença crônica grave", max: 10 },
  { key: "pts_deficiencia_familia", label: "Familiar com deficiência", max: 10 },
  { key: "pts_beneficio_social", label: "Benefício social (Bolsa Família / BPC)", max: 10 },
  { key: "pts_zona_rural", label: "Reside em zona rural ou município distinto", max: 10 },
];
 
export const classifColor = {
  "Vulnerabilidade I": "#15803d",
  "Vulnerabilidade II": "#1d4ed8",
  "Vulnerabilidade III": "#a16207",
  "Não prioritário": "#dc2626",
};
 