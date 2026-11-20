import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  private async validarRelacionamentos(lojaId?: number, categoriaId?: number) {
    if (lojaId !== undefined) {
      const loja = await this.prisma.loja.findUnique({ where: { id: lojaId } });
      if (!loja) throw new BadRequestException(`Loja com ID ${lojaId} não existe.`);
    }
    if (categoriaId !== undefined) {
      const categoria = await this.prisma.categoria.findUnique({ where: { id: categoriaId } });
      if (!categoria) throw new BadRequestException(`Categoria com ID ${categoriaId} não existe.`);
    }
  }

  private tratarErro(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Relacionamento inválido: confira lojaId e categoriaId.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Produto não encontrado.');
      }
    }
    throw error;
  }

  private async assertOwner(produtoId: number, usuarioId: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id: produtoId },
      include: { loja: true },
    });
    if (!produto) throw new NotFoundException(`Produto com ID ${produtoId} não encontrado.`);
    if (produto.loja.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para alterar este produto.');
    }
    return produto;
  }

  async create(dto: CreateProdutoDto, usuarioId: number) {
    await this.validarRelacionamentos(dto.lojaId, dto.categoriaId);
    const loja = await this.prisma.loja.findUnique({ where: { id: dto.lojaId } });
    if (loja && loja.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para adicionar produtos nesta loja.');
    }
    try {
      return await this.prisma.produto.create({
        data: {
          lojaId: dto.lojaId,
          categoriaId: dto.categoriaId,
          nome: dto.nome,
          descricao: dto.descricao,
          preco: dto.preco,
          estoque: dto.estoque,
          ativo: dto.ativo ?? true,
          ...(dto.imagens?.length
            ? {
                imagens: {
                  create: dto.imagens.map((urlImagem, index) => ({
                    urlImagem,
                    ordem: index + 1,
                  })),
                },
              }
            : {}),
        },
        include: { loja: true, categoria: true, imagens: true },
      });
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async findAll(lojaId?: number) {
    return this.prisma.produto.findMany({
      where: lojaId !== undefined ? { lojaId } : undefined,
      include: { loja: true, categoria: true, imagens: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    if (!Number.isInteger(id) || id < 1) throw new BadRequestException('ID inválido.');
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { loja: true, categoria: true, imagens: true },
    });
    if (!produto) throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    return produto;
  }

  async update(id: number, dto: UpdateProdutoDto, usuarioId: number) {
    await this.assertOwner(id, usuarioId);
    await this.validarRelacionamentos(dto.lojaId, dto.categoriaId);
    if (dto.lojaId !== undefined) {
      const loja = await this.prisma.loja.findUnique({ where: { id: dto.lojaId } });
      if (loja?.usuarioId !== usuarioId) throw new ForbiddenException('Você não tem permissão para mover o produto para esta loja.');
    }
    try {
      return await this.prisma.produto.update({
        where: { id },
        data: {
          ...(dto.lojaId !== undefined && { lojaId: dto.lojaId }),
          ...(dto.categoriaId !== undefined && { categoriaId: dto.categoriaId }),
          ...(dto.nome !== undefined && { nome: dto.nome }),
          ...(dto.descricao !== undefined && { descricao: dto.descricao }),
          ...(dto.preco !== undefined && { preco: dto.preco }),
          ...(dto.estoque !== undefined && { estoque: dto.estoque }),
          ...(dto.ativo !== undefined && { ativo: dto.ativo }),
        },
        include: { loja: true, categoria: true, imagens: true },
      });
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async remove(id: number, usuarioId: number) {
    await this.assertOwner(id, usuarioId);
    try {
      return await this.prisma.produto.delete({ where: { id } });
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async findImages(produtoId: number) {
    await this.findOne(produtoId);
    return this.prisma.imagemProduto.findMany({ where: { produtoId }, orderBy: { ordem: 'asc' } });
  }

  async addImages(produtoId: number, urls: string[], usuarioId: number) {
    await this.assertOwner(produtoId, usuarioId);
    const existentes = await this.prisma.imagemProduto.findMany({ where: { produtoId } });
    if (existentes.length + urls.length > 4) throw new BadRequestException('Cada produto pode ter no máximo 4 imagens.');
    const inicio = existentes.reduce((maior, imagem) => Math.max(maior, imagem.ordem), 0);
    await this.prisma.$transaction(urls.map((urlImagem, index) => this.prisma.imagemProduto.create({
      data: { produtoId, urlImagem, ordem: inicio + index + 1 },
    })));
    return this.findImages(produtoId);
  }

  async updateImage(produtoId: number, imagemId: number, urlImagem: string, usuarioId: number) {
    await this.assertOwner(produtoId, usuarioId);
    const imagem = await this.prisma.imagemProduto.findFirst({ where: { id: imagemId, produtoId } });
    if (!imagem) throw new NotFoundException('Imagem do produto não encontrada.');
    return this.prisma.imagemProduto.update({ where: { id: imagemId }, data: { urlImagem } });
  }

  async reorderImages(produtoId: number, imagens: Array<{ id: number; ordem: number }>, usuarioId: number) {
    await this.assertOwner(produtoId, usuarioId);
    const existentes = await this.prisma.imagemProduto.findMany({ where: { produtoId } });
    const ids = new Set(existentes.map((imagem) => imagem.id));
    if (imagens.length !== existentes.length || imagens.some((imagem) => !ids.has(imagem.id)) || new Set(imagens.map((imagem) => imagem.ordem)).size !== imagens.length) {
      throw new BadRequestException('Informe todas as imagens do produto com ordens únicas.');
    }
    await this.prisma.$transaction(async (tx) => {
      for (const [index, imagem] of imagens.entries()) {
        await tx.imagemProduto.update({ where: { id: imagem.id }, data: { ordem: -(index + 1) } });
      }
      for (const imagem of imagens) {
        await tx.imagemProduto.update({ where: { id: imagem.id }, data: { ordem: imagem.ordem } });
      }
    });
    return this.findImages(produtoId);
  }

  async removeImage(produtoId: number, imagemId: number, usuarioId: number) {
    await this.assertOwner(produtoId, usuarioId);
    const imagem = await this.prisma.imagemProduto.findFirst({ where: { id: imagemId, produtoId } });
    if (!imagem) throw new NotFoundException('Imagem do produto não encontrada.');
    await this.prisma.imagemProduto.delete({ where: { id: imagemId } });
    const restantes = await this.prisma.imagemProduto.findMany({ where: { produtoId }, orderBy: { ordem: 'asc' } });
    await this.prisma.$transaction(restantes.map((item, index) => this.prisma.imagemProduto.update({ where: { id: item.id }, data: { ordem: index + 1 } })));
    return this.findImages(produtoId);
  }
}
