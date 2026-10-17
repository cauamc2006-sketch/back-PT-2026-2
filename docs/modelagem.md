# Modelagem do Banco

## Visão geral

9 tabelas em PostgreSQL cobrindo autenticação, catálogo, lojas,
produtos, avaliações e comentários.

## Relacionamentos principais

- usuarios 1 ── N lojas
- lojas 1 ── N produtos
- categorias 1 ── N produtos
- categorias 1 ── N categorias (hierarquia)
- produtos 1 ── N imagens_produto
- usuarios 1 ── N avaliacoes_produtos
- usuarios 1 ── N avaliacoes_lojas
- comentarios_avaliacoes → pertence a UMA avaliação (loja OU produto)

## Dicionário de dados

### usuarios
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| username | VARCHAR(50) | Único, obrigatório |
| nome | VARCHAR(255) | Obrigatório |
| email | VARCHAR(255) | Único, obrigatório |
| senha_hash | VARCHAR(255) | Obrigatório |
| foto_perfil_url | VARCHAR(255) | Opcional |
| criadoEm | TIMESTAMP | Auto |
| atualizadoEm | TIMESTAMP | Auto (trigger) |

### categorias
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| nome | VARCHAR(100) | Obrigatório |
| slug | VARCHAR(120) | Único, obrigatório |
| descricao | TEXT | Opcional |
| imagem_url | VARCHAR(255) | Opcional |
| categoria_pai_id | INTEGER | FK → categorias, SET NULL |
| criadoEm, atualizadoEm | TIMESTAMP | Auto |

### lojas
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| usuario_id | INTEGER | FK → usuarios, CASCADE |
| nome | VARCHAR(255) | Obrigatório |
| descricao | TEXT | Opcional |
| logo_url, banner_url, sticker_url | VARCHAR(255) | Opcionais |
| criadoEm, atualizadoEm | TIMESTAMP | Auto |

### produtos
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| loja_id | INTEGER | FK → lojas, CASCADE |
| categoria_id | INTEGER | FK → categorias |
| nome | VARCHAR(255) | Obrigatório |
| descricao | TEXT | Opcional |
| preco | DECIMAL(10,2) | >= 0 |
| estoque | INTEGER | >= 0 |
| ativo | BOOLEAN | Default TRUE |
| criadoEm, atualizadoEm | TIMESTAMP | Auto |

### imagens_produto
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| produto_id | INTEGER | FK → produtos, CASCADE |
| url_imagem | VARCHAR(255) | Obrigatório |
| ordem | INTEGER | Único por produto |

### avaliacoes_produtos
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| usuario_id | INTEGER | FK → usuarios, CASCADE |
| produto_id | INTEGER | FK → produtos, CASCADE |
| nota | INTEGER | Entre 0 e 5 |
| comentario | TEXT | Opcional |
| criadoEm, atualizadoEm | TIMESTAMP | Auto |
| Único | — | 1 avaliação por usuário/produto |

### avaliacoes_lojas
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| usuario_id | INTEGER | FK → usuarios, CASCADE |
| loja_id | INTEGER | FK → lojas, CASCADE |
| nota | INTEGER | Entre 0 e 5 |
| comentario | TEXT | Opcional |
| criadoEm, atualizadoEm | TIMESTAMP | Auto |
| Único | — | 1 avaliação por usuário/loja |

### comentarios_avaliacoes
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| usuario_id | INTEGER | FK → usuarios, CASCADE |
| avaliacao_loja_id | INTEGER | FK, opcional |
| avaliacao_produto_id | INTEGER | FK, opcional |
| conteudo | TEXT | Obrigatório |
| criadoEm, atualizadoEm | TIMESTAMP | Auto |
| CHECK | — | Aponta pra loja OU produto, nunca os dois |

### tokens_recuperacao_senha
| Coluna | Tipo | Regra |
|---|---|---|
| id | SERIAL | PK |
| usuario_id | INTEGER | FK → usuarios, CASCADE |
| token | VARCHAR(255) | Único |
| expira_em | TIMESTAMP | Obrigatório |
| usado | BOOLEAN | Default FALSE |
| criadoEm | TIMESTAMP | Auto |

## Boas práticas aplicadas

- Normalização até 3FN
- Integridade referencial completa
- Índices em todas as FKs e campos de busca
- Trigger para atualizadoEm
- CHECKs de regras de negócio
- UNIQUEs para evitar duplicidade

## Requisitos atendidos

Cobre as histórias de usuário US01 a US40.
