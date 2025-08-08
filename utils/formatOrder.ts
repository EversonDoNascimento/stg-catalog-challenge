type PedidoProduto = {
  nome: string;
  quantidade: number;
  preco: number;
};

type PedidoDados = {
  nomeCliente: string;
  emailCliente: string;
  produtos: PedidoProduto[];
};

export default function formatOrder({
  nomeCliente,
  emailCliente,
  produtos,
}: PedidoDados): string {
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const listaProdutos = produtos
    .map(
      (p) =>
        `• ${p.nome} - Qtd: ${p.quantidade} - ${currency.format(
          p.preco * p.quantidade
        )}`
    )
    .join("\n");

  const total = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  return `🛍️ NOVO PEDIDO - STG CATALOG
👤 Cliente: ${nomeCliente}
📧 Email: ${emailCliente}
🛒 PRODUTOS:
${listaProdutos}
💰 TOTAL: ${currency.format(total)}
---
Pedido via STG Catalog`;
}
