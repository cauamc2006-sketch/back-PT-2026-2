export type produtodto = {
    id: number;
    lojaId: number;
    categoriaId: number;
    nome: string;
    descricao?: string;
    preco: number;
    estoque: number;
    ativo: boolean;
}
