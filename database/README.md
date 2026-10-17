# Banco de Dados

Modelagem do banco em PostgreSQL.

## Estrutura

| Tabela | Função |
|---|---|
| usuarios | Cadastro, login e perfil |
| categorias | Categorias com hierarquia pai/filho |
| jogos | Lojas do sistema |
| produtos | Itens das lojas |
| imagens_produto | Galeria de imagens |
| avaliacoes_produtos | Avaliações de produtos |
| avaliacoes_jogos | Avaliações de lojas |
| comentarios_avaliacoes | Comentários em avaliações |
| tokens_recuperacao_senha | Tokens para recuperação de senha |

## Como rodar

1. Cria o banco:
   CREATE DATABASE marketplace;

2. Roda o script:
   psql -d marketplace -f database/modelo_bd.sql

3. (Opcional) Popula com dados de teste:
   psql -d marketplace -f database/seeds.sql

## Regras de negócio

- Toda FK tem ON DELETE CASCADE (exceto categorias → SET NULL)
- Nota das avaliações entre 0 e 5
- Comentário aponta para avaliação de loja OU produto
- atualizadoEm é atualizado por trigger
- Uma categoria não pode ser pai dela mesma

## Requisitos atendidos

Cobre as histórias de usuário US01 a US40.
