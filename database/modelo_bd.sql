DROP TABLE IF EXISTS
    tokens_recuperacao_senha,
    comentarios_avaliacoes,
    avaliacoes_produtos,
    avaliacoes_jogos,
    imagens_produto,
    produtos,
    jogos,
    categorias,
    usuarios
CASCADE;

CREATE TABLE usuarios (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    nome            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    senha_hash      VARCHAR(255) NOT NULL,
    foto_perfil_url VARCHAR(255),
    "criadoEm"      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm"  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id               SERIAL PRIMARY KEY,
    nome             VARCHAR(100) NOT NULL,
    slug             VARCHAR(120) NOT NULL UNIQUE,
    descricao        TEXT,
    imagem_url       VARCHAR(255),
    categoria_pai_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    "criadoEm"       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm"   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_categoria_nao_self
        CHECK (categoria_pai_id IS NULL OR categoria_pai_id <> id)
);

CREATE TABLE jogos (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome           VARCHAR(255) NOT NULL,
    descricao      TEXT,
    logo_url       VARCHAR(255),
    banner_url     VARCHAR(255),
    sticker_url    VARCHAR(255),
    "criadoEm"     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id             SERIAL PRIMARY KEY,
    jogo_id        INTEGER NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
    categoria_id   INTEGER NOT NULL REFERENCES categorias(id),
    nome           VARCHAR(255) NOT NULL,
    descricao      TEXT,
    preco          DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    estoque        INTEGER NOT NULL CHECK (estoque >= 0),
    ativo          BOOLEAN NOT NULL DEFAULT TRUE,
    "criadoEm"     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imagens_produto (
    id         SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    url_imagem VARCHAR(255) NOT NULL,
    ordem      INTEGER NOT NULL,
    CONSTRAINT uq_imagem_ordem UNIQUE (produto_id, ordem)
);

CREATE TABLE avaliacoes_produtos (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id     INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    nota           INTEGER NOT NULL CHECK (nota BETWEEN 0 AND 5),
    comentario     TEXT,
    "criadoEm"     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_avaliacao_produto UNIQUE (usuario_id, produto_id)
);

CREATE TABLE avaliacoes_jogos (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    jogo_id        INTEGER NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
    nota           INTEGER NOT NULL CHECK (nota BETWEEN 0 AND 5),
    comentario     TEXT,
    "criadoEm"     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_avaliacao_jogo UNIQUE (usuario_id, jogo_id)
);

CREATE TABLE comentarios_avaliacoes (
    id                     SERIAL PRIMARY KEY,
    usuario_id             INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    avaliacao_jogo_id      INTEGER REFERENCES avaliacoes_jogos(id) ON DELETE CASCADE,
    avaliacao_produto_id   INTEGER REFERENCES avaliacoes_produtos(id) ON DELETE CASCADE,
    conteudo               TEXT NOT NULL,
    "criadoEm"             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm"         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_comentario_unico CHECK (
        (avaliacao_jogo_id IS NOT NULL AND avaliacao_produto_id IS NULL) OR
        (avaliacao_jogo_id IS NULL AND avaliacao_produto_id IS NOT NULL)
    )
);

CREATE TABLE tokens_recuperacao_senha (
    id         SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expira_em  TIMESTAMP NOT NULL,
    usado      BOOLEAN NOT NULL DEFAULT FALSE,
    "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jogos_usuario      ON jogos(usuario_id);
CREATE INDEX idx_produtos_jogo      ON produtos(jogo_id);
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_imagens_produto    ON imagens_produto(produto_id);
CREATE INDEX idx_av_produto_usuario ON avaliacoes_produtos(usuario_id);
CREATE INDEX idx_av_produto_produto ON avaliacoes_produtos(produto_id);
CREATE INDEX idx_av_jogo_usuario    ON avaliacoes_jogos(usuario_id);
CREATE INDEX idx_av_jogo_jogo       ON avaliacoes_jogos(jogo_id);
CREATE INDEX idx_coment_av_jogo     ON comentarios_avaliacoes(avaliacao_jogo_id);
CREATE INDEX idx_coment_av_produto  ON comentarios_avaliacoes(avaliacao_produto_id);
CREATE INDEX idx_tokens_usuario     ON tokens_recuperacao_senha(usuario_id);
CREATE INDEX idx_tokens_token       ON tokens_recuperacao_senha(token);
CREATE INDEX idx_produtos_nome      ON produtos(nome);
CREATE INDEX idx_jogos_nome         ON jogos(nome);
CREATE INDEX idx_categorias_slug    ON categorias(slug);

CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW."atualizadoEm" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_updated
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trg_categorias_updated
    BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trg_jogos_updated
    BEFORE UPDATE ON jogos
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trg_produtos_updated
    BEFORE UPDATE ON produtos
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trg_av_produtos_updated
    BEFORE UPDATE ON avaliacoes_produtos
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trg_av_jogos_updated
    BEFORE UPDATE ON avaliacoes_jogos
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trg_comentarios_updated
    BEFORE UPDATE ON comentarios_avaliacoes
    FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
