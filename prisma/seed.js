const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do STOCK.IO...');

  // 1. Usuários
  const usuariosData = [
    { username: 'admin', nome: 'Administrador StockIO', email: 'admin@stockio.com', senhaHash: '$2b$10$wO8oF7Edf1zY6c0eQ4W5E.examplefakehash' },
    { username: 'techstore_user', nome: 'Carlos Tech', email: 'carlos@techstore.com', senhaHash: '$2b$10$wO8oF7Edf1zY6c0eQ4W5E.examplefakehash' },
    { username: 'moda_user', nome: 'Beatriz Moda', email: 'beatriz@style.com', senhaHash: '$2b$10$wO8oF7Edf1zY6c0eQ4W5E.examplefakehash' },
    { username: 'gamezone_user', nome: 'Lucas Gamer', email: 'lucas@gamezone.com', senhaHash: '$2b$10$wO8oF7Edf1zY6c0eQ4W5E.examplefakehash' },
    { username: 'mercado_user', nome: 'Marcos Mercado', email: 'marcos@mercadobompreco.com', senhaHash: '$2b$10$wO8oF7Edf1zY6c0eQ4W5E.examplefakehash' },
  ];

  for (const u of usuariosData) {
    await prisma.usuario.upsert({
      where: { username: u.username },
      update: { nome: u.nome, email: u.email },
      create: u,
    });
  }

  const userTech = await prisma.usuario.findUnique({ where: { username: 'techstore_user' } });
  const userModa = await prisma.usuario.findUnique({ where: { username: 'moda_user' } });
  const userGame = await prisma.usuario.findUnique({ where: { username: 'gamezone_user' } });
  const userMercado = await prisma.usuario.findUnique({ where: { username: 'mercado_user' } });

  // 2. Lojas Parceiras
  const lojasData = [
    {
      nome: 'TechStore Brasil',
      descricao: 'Os melhores eletrônicos e novidades do mundo tech com garantia total.',
      logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
      usuarioId: userTech.id,
    },
    {
      nome: 'Style & Co.',
      descricao: 'Moda autêntica, streetwear e calçados premium para o seu estilo único.',
      logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80',
      usuarioId: userModa.id,
    },
    {
      nome: 'GameZone Pro',
      descricao: 'Consoles de última geração, jogos clássicos e acessórios gamers de alta performance.',
      logoUrl: 'https://images.unsplash.com/photo-1612287233207-649dfd10a97a?w=150&auto=format&fit=crop&q=80',
      usuarioId: userGame.id,
    },
    {
      nome: 'Supermercado Bom Preço',
      descricao: 'Tudo o que você precisa para o seu dia a dia com praticidade e economia.',
      logoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80',
      usuarioId: userMercado.id,
    },
  ];

  const lojasCriadas = [];
  for (const l of lojasData) {
    const lojaExistente = await prisma.loja.findFirst({ where: { nome: l.nome } });
    if (lojaExistente) {
      lojasCriadas.push(lojaExistente);
    } else {
      const novaLoja = await prisma.loja.create({ data: l });
      lojasCriadas.push(novaLoja);
    }
  }

  const [lojaTech, lojaStyle, lojaGame, lojaMercado] = lojasCriadas;

  // 3. Categorias Principais (8 oficiais do Figma)
  const categoriasPrincipais = [
    { nome: 'Eletrônicos', slug: 'eletronicos', descricao: 'O universo da tecnologia em um só lugar' },
    { nome: 'Moda', slug: 'moda', descricao: 'Seu estilo, suas escolhas, do seu jeito' },
    { nome: 'Jogos', slug: 'jogos', descricao: 'Jogabilidade e diversão em um nível superior' },
    { nome: 'Mercado', slug: 'mercado', descricao: 'O essencial para o seu dia a dia com praticidade' },
    { nome: 'Farmácia', slug: 'farmacia', descricao: 'Saúde, bem-estar e cuidados sempre ao seu alcance' },
    { nome: 'Beleza', slug: 'beleza', descricao: 'Realce o que há de melhor em você em cada detalhe' },
    { nome: 'Brinquedos', slug: 'brinquedos', descricao: 'A imaginação ganha vida para todas as idades' },
    { nome: 'Casa', slug: 'casa', descricao: 'Conforto e praticidade para o seu cantinho' },
  ];

  const catMap = new Map();
  for (const cp of categoriasPrincipais) {
    const c = await prisma.categoria.upsert({
      where: { slug: cp.slug },
      update: { nome: cp.nome, descricao: cp.descricao },
      create: cp,
    });
    catMap.set(cp.slug, c);
  }

  // 4. Subcategorias vinculadas (Hierarquia relacional categoriaPaiId)
  const subcategoriasPorPai = {
    eletronicos: ['Celulares', 'Notebooks', 'TVs', 'Acessórios', 'Outros'],
    jogos: ['Consoles', 'Jogos', 'Controles', 'Headsets', 'Acessórios', 'Outros'],
    moda: ['Roupas', 'Calçados', 'Acessórios', 'Bolsas', 'Outros'],
    mercado: ['Alimentos', 'Bebidas', 'Doces', 'Limpeza', 'Outros'],
    farmacia: ['Medicamentos', 'Vitaminas', 'Higiene', 'Cuidados', 'Outros'],
    beleza: ['Maquiagem', 'Skincare', 'Cabelos', 'Perfumes', 'Outros'],
    brinquedos: ['Educativos', 'Bonecos', 'Jogos de Tabuleiro', 'Blocos', 'Outros'],
    casa: ['Decoração', 'Cozinha', 'Cama e Banho', 'Organização', 'Outros'],
  };

  const subMap = new Map();
  for (const [paiSlug, subs] of Object.entries(subcategoriasPorPai)) {
    const pai = catMap.get(paiSlug);
    if (!pai) continue;

    for (const subNome of subs) {
      const subSlug = `${paiSlug}-${subNome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}`;
      const sub = await prisma.categoria.upsert({
        where: { slug: subSlug },
        update: { nome: subNome, categoriaPaiId: pai.id },
        create: {
          nome: subNome,
          slug: subSlug,
          descricao: `Subcategoria ${subNome} de ${pai.nome}`,
          categoriaPaiId: pai.id,
        },
      });
      subMap.set(`${paiSlug}:${subNome}`, sub);
    }
  }

  // 5. Produtos Completos para Teste
  const produtosData = [
    // --- ELETRÔNICOS ---
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'iPhone 15 Pro Max 256GB Titânio',
      descricao: 'Smartphone Apple com tela Super Retina XDR de 6.7", chip A17 Pro e sistema de câmera de 48MP.',
      preco: 7899.00,
      estoque: 15,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'Samsung Galaxy S24 Ultra 512GB',
      descricao: 'Com inteligência artificial Galaxy AI integrada, câmera de 200MP e caneta S Pen inclusa.',
      preco: 6499.00,
      estoque: 20,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'MacBook Air M2 13.6" 16GB RAM',
      descricao: 'Design incrivelmente fino, bateria para até 18 horas e desempenho veloz para produtividade.',
      preco: 8299.00,
      estoque: 8,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'Notebook Gamer Dell G15 RTX 4050',
      descricao: 'Processador Intel Core i7 13ª geração, 16GB RAM DDR5, SSD 512GB NVMe e tela 165Hz.',
      preco: 5299.00,
      estoque: 12,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'Smart TV 55" 4K OLED Ultra HD',
      descricao: 'Cores perfeitas, taxa de atualização de 120Hz nativa, Dolby Vision e som surround cinematográfico.',
      preco: 4399.00,
      estoque: 5,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'Fone de Ouvido Bluetooth Noise Cancelling',
      descricao: 'Cancelamento ativo de ruído inteligente, bateria para 30h de reprodução e graves profundos.',
      preco: 299.90,
      estoque: 40,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'Mouse Gamer RGB 16000 DPI Sensor Óptico',
      descricao: 'Sensor ultrarrápido, 7 botões programáveis e iluminação RGB customizável via software.',
      preco: 149.90,
      estoque: 25,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaTech.id,
      categoriaId: catMap.get('eletronicos').id,
      nome: 'Teclado Mecânico RGB Switch Blue (Esgotado)',
      descricao: 'Layout compacto 75%, teclas anti-ghosting e switches mecânicos com resposta tátil nítida.',
      preco: 320.00,
      estoque: 0, // INDISPONÍVEL PARA TESTES DE ORDENAÇÃO
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    },

    // --- JOGOS ---
    {
      lojaId: lojaGame.id,
      categoriaId: catMap.get('jogos').id,
      nome: 'PlayStation 5 Slim 1TB Edição Digital',
      descricao: 'Carregamento ultrarrápido com SSD personalizado, feedback tátil e áudio 3D imersivo.',
      preco: 3799.00,
      estoque: 10,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaGame.id,
      categoriaId: catMap.get('jogos').id,
      nome: 'Nintendo Switch OLED 64GB Neon',
      descricao: 'Tela OLED vibrante de 7 polegadas, suporte ajustável amplo e áudio aprimorado.',
      preco: 2199.00,
      estoque: 14,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaGame.id,
      categoriaId: catMap.get('jogos').id,
      nome: 'Jogo The Legend of Zelda: Tears of the Kingdom',
      descricao: 'A aventura épica pelas terras e céus de Hyrule aguarda suas criações mais inventivas.',
      preco: 299.90,
      estoque: 22,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaGame.id,
      categoriaId: catMap.get('jogos').id,
      nome: 'Controle Sem Fio DualSense Midnight Black',
      descricao: 'Gatilhos adaptáveis dinâmicos, microfone embutido e design icônico em preto fosco.',
      preco: 429.00,
      estoque: 18,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaGame.id,
      categoriaId: catMap.get('jogos').id,
      nome: 'Headset Gamer 7.1 Surround Wireless (Esgotado)',
      descricao: 'Microfone retrátil com cancelamento de ruído e almofadas de espuma com memória.',
      preco: 389.90,
      estoque: 0, // INDISPONÍVEL
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
    },

    // --- MODA ---
    {
      lojaId: lojaStyle.id,
      categoriaId: catMap.get('moda').id,
      nome: 'Camiseta Oversized Streetwear 100% Algodão',
      descricao: 'Modelagem ampla moderna, gramatura pesada e caimento impecável para uso urbano.',
      preco: 89.90,
      estoque: 50,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaStyle.id,
      categoriaId: catMap.get('moda').id,
      nome: 'Jaqueta Corta-Vento Esportiva Impermeável',
      descricao: 'Tecido tecnológico repelente a água, capuz ajustável e forro interno respirável.',
      preco: 189.90,
      estoque: 30,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaStyle.id,
      categoriaId: catMap.get('moda').id,
      nome: 'Tênis Casual Branco Urban Comfort',
      descricao: 'Solado amortecido e acabamento premium em couro sintético macio para o dia a dia.',
      preco: 279.90,
      estoque: 15,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaStyle.id,
      categoriaId: catMap.get('moda').id,
      nome: 'Mochila Executiva para Notebook Impermeável',
      descricao: 'Compartimento acolchoado para notebook até 16", entrada USB e múltiplos bolsos internos.',
      preco: 199.90,
      estoque: 25,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    },

    // --- MERCADO ---
    {
      lojaId: lojaMercado.id,
      categoriaId: catMap.get('mercado').id,
      nome: 'Café Especial Torrado e Moído Gourmet 500g',
      descricao: '100% Arábica, torra média com notas florais e caramelo. Aroma marcante e frescor.',
      preco: 24.90,
      estoque: 80,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaMercado.id,
      categoriaId: catMap.get('mercado').id,
      nome: 'Azeite de Oliva Extra Virgem 500ml Primeira Prensa',
      descricao: 'Acidez máxima 0.2%, produzido a frio com azeitonas selecionadas nobreza de sabor.',
      preco: 39.90,
      estoque: 45,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaMercado.id,
      categoriaId: catMap.get('mercado').id,
      nome: 'Barra de Chocolate 70% Cacau com Castanhas',
      descricao: 'Chocolate belga autêntico com pedaços crocantes de castanha do Pará.',
      preco: 14.50,
      estoque: 60,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=80',
    },

    // --- FARMÁCIA ---
    {
      lojaId: lojaMercado.id,
      categoriaId: catMap.get('farmacia').id,
      nome: 'Multivitamínico Completo A-Z 60 Cápsulas',
      descricao: 'Suplemento nutricional balanceado com vitaminas e minerais essenciais para a imunidade.',
      preco: 49.90,
      estoque: 50,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaMercado.id,
      categoriaId: catMap.get('farmacia').id,
      nome: 'Protetor Solar Facial Toque Seco FPS 60',
      descricao: 'Controle de oleosidade por até 12h, proteção contra raios UVA/UVB e luz visível.',
      preco: 69.90,
      estoque: 30,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    },

    // --- BELEZA ---
    {
      lojaId: lojaStyle.id,
      categoriaId: catMap.get('beleza').id,
      nome: 'Sérum Facial Ácido Hialurônico e Vitamina C',
      descricao: 'Ação antioxidante e preenchedora, revitaliza o brilho natural e uniformiza o tom da pele.',
      preco: 79.90,
      estoque: 25,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaStyle.id,
      categoriaId: catMap.get('beleza').id,
      nome: 'Batom Líquido Matte Longa Duração Veludo',
      descricao: 'Fórmula hidratante que não resseca os lábios, cor intensa e acabamento fosco aveludado.',
      preco: 39.90,
      estoque: 35,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
    },

    // --- BRINQUEDOS ---
    {
      lojaId: lojaGame.id,
      categoriaId: catMap.get('brinquedos').id,
      nome: 'Blocos de Montar Estação Espacial 520 Peças',
      descricao: 'Estimula a criatividade e coordenação motora com peças articuladas e mini astronautas.',
      preco: 149.90,
      estoque: 20,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaGame.id,
      categoriaId: catMap.get('brinquedos').id,
      nome: 'Jogo de Tabuleiro Estratégia de Colonização',
      descricao: 'Jogo clássico premiado para 3 a 4 jogadores, disputas comerciais e muita diversão.',
      preco: 129.90,
      estoque: 15,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&auto=format&fit=crop&q=80',
    },

    // --- CASA ---
    {
      lojaId: lojaMercado.id,
      categoriaId: catMap.get('casa').id,
      nome: 'Luminária de Mesa Articulada Minimalista LED',
      descricao: 'Controle de intensidade de luz touch, 3 tons de cor e braço articulado em metal escovado.',
      preco: 89.90,
      estoque: 22,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80',
    },
    {
      lojaId: lojaMercado.id,
      categoriaId: catMap.get('casa').id,
      nome: 'Jogo de Panelas Cerâmica Antiaderente 5 Peças',
      descricao: 'Cozimento uniforme sem grudar, tampas de vidro temperado e cabos com toque suave antiaquecimento.',
      preco: 349.90,
      estoque: 8,
      ativo: true,
      imagem: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80',
    },
  ];

  for (const p of produtosData) {
    const { imagem, ...dadosProduto } = p;

    // Busca se já existe um produto com o mesmo nome e loja para garantir idempotência (sem duplicatas)
    let produto = await prisma.produto.findFirst({
      where: { nome: dadosProduto.nome, lojaId: dadosProduto.lojaId },
    });

    if (produto) {
      produto = await prisma.produto.update({
        where: { id: produto.id },
        data: dadosProduto,
      });
    } else {
      produto = await prisma.produto.create({
        data: dadosProduto,
      });
    }

    if (imagem) {
      const imgExistente = await prisma.imagemProduto.findFirst({
        where: { produtoId: produto.id, ordem: 1 },
      });

      if (imgExistente) {
        await prisma.imagemProduto.update({
          where: { id: imgExistente.id },
          data: { urlImagem: imagem },
        });
      } else {
        await prisma.imagemProduto.create({
          data: {
            produtoId: produto.id,
            urlImagem: imagem,
            ordem: 1,
          },
        });
      }
    }
  }

  console.log(`✅ Seed finalizado com sucesso!`);
  console.log(`- 8 Categorias Raiz`);
  console.log(`- 40 Subcategorias Hierarquizadas`);
  console.log(`- 4 Lojas Parceiras`);
  console.log(`- ${produtosData.length} Produtos Cadastrados com Imagens e Preços variados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
