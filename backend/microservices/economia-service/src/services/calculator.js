const calcularFriendCoins = (peso_acao, indice_impacto, fator_surpresa, reducao_repeticao) => {
  const fc_ganho = (peso_acao * indice_impacto * fator_surpresa) * reducao_repeticao;
  return Math.round(fc_ganho);
};

const gerarFatorSurpresa = () => {
  return 0.8 + (Math.random() * 0.4);
};

const calcularReducaoRepeticao = (n_interacoes) => {
  if (n_interacoes === 0) return 1.0;
  return 1 / (1 + Math.log(n_interacoes + 1));
};

module.exports = {
  calcularFriendCoins,
  gerarFatorSurpresa,
  calcularReducaoRepeticao
};
