import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';

@Injectable()
export class AvaliacaoProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAvaliacaoProdutoDto, usuarioId: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id: data.produtoId },
      include: { loja: true },
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (produto.loja.usuarioId === usuarioId) {
      throw new BadRequestException(
        'Você não pode avaliar um produto da sua própria loja',
      );
    }

    try {
      return await this.prisma.avaliacaoProduto.create({
        data: {
          usuarioId,
          produtoId: data.produtoId,
          nota: data.nota,
          comentario: data.comentario,
        },
        include: {
          usuario: {
            select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Você já avaliou este produto');
      }
      throw error;
    }
  }

  async findAll(produtoId?: number, usuarioId?: number) {
    return this.prisma.avaliacaoProduto.findMany({
      where: {
        ...(produtoId ? { produtoId } : {}),
        ...(usuarioId ? { usuarioId } : {}),
      },
      orderBy: { criadoEm: 'desc' },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const avaliacao = await this.prisma.avaliacaoProduto.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
      },
    });
    if (!avaliacao) {
      throw new NotFoundException('Avaliação do produto não encontrada');
    }
    return avaliacao;
  }

  async update(id: number, data: UpdateAvaliacaoProdutoDto, usuarioId: number) {
    const avaliacao = await this.findOne(id);
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Você só pode editar suas próprias avaliações',
      );
    }

    return this.prisma.avaliacaoProduto.update({
      where: { id },
      data: {
        ...(data.nota !== undefined ? { nota: data.nota } : {}),
        ...(data.comentario !== undefined ? { comentario: data.comentario } : {}),
      },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    const avaliacao = await this.findOne(id);
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Você só pode remover suas próprias avaliações',
      );
    }

    return this.prisma.avaliacaoProduto.delete({
      where: { id },
    });
  }
}
