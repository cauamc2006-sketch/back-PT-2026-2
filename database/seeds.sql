-- Dados de teste para desenvolvimento

INSERT INTO usuarios (username, nome, email, senha_hash) VALUES
('joao',  'João Silva',  'joao@email.com',  'hash_fake_1'),
('maria', 'Maria Souza', 'maria@email.com', 'hash_fake_2'),
('pedro', 'Pedro Lima',  'pedro@email.com', 'hash_fake_3');

INSERT INTO categorias (nome, slug, descricao) VALUES
('Eletrônicos', 'eletronicos', 'Produtos eletrônicos em geral'),
('Roupas',      'roupas',      'Vestuário e acessórios'),
('Jogos',       'lojas',       'Jogos e consoles');

INSERT INTO lojas (usuario_id, nome, descricao) VALUES
(1, 'Loja do João', 'Eletrônicos e acessórios'),
(2, 'Moda Maria',   'Roupas e calçados');

INSERT INTO produtos (loja_id, categoria_id, nome, descricao, preco, estoque) VALUES
(1, 1, 'Fone Bluetooth', 'Fone sem fio com cancelamento de ruído', 199.90, 50),
(1, 1, 'Mouse Gamer',    'Mouse com 6 botões e RGB',                150.00, 30),
(2, 2, 'Camiseta Preta', 'Camiseta 100% algodão',                    59.90, 100);

INSERT INTO imagens_produto (produto_id, url_imagem, ordem) VALUES
(1, 'https://exemplo.com/fone-1.jpg', 1),
(1, 'https://exemplo.com/fone-2.jpg', 2),
(2, 'https://exemplo.com/mouse-1.jpg', 1);

INSERT INTO avaliacoes_produtos (usuario_id, produto_id, nota, comentario) VALUES
(2, 1, 5, 'Excelente qualidade de som!'),
(3, 1, 4, 'Bom, mas demorou pra chegar.'),
(1, 3, 5, 'Camiseta muito confortável.');

INSERT INTO avaliacoes_lojas (usuario_id, loja_id, nota, comentario) VALUES
(2, 1, 5, 'Loja confiável, recomendo.'),
(3, 2, 4, 'Boa variedade de produtos.');
