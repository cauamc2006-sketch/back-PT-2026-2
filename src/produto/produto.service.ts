import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateProdutoDto) {
    await this.validarRelacionamentos(dto.lojaId, dto.categoriaId);
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
        },
        include: { loja: true, categoria: true, imagens: true },
      });
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async findAll() {
    return this.prisma.produto.findMany({
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

  async update(id: number, dto: UpdateProdutoDto) {
    await this.findOne(id);
    await this.validarRelacionamentos(dto.lojaId, dto.categoriaId);
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

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prisma.produto.delete({ where: { id } });
    } catch (error) {
      this.tratarErro(error);
    }
  }
}
