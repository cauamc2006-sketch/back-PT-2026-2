import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Injectable()
export class AvaliacaoLojaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAvaliacaoLojaDto, usuarioId: number) {
    const loja = await this.prisma.loja.findUnique({
      where: { id: data.lojaId },
    });
    if (!loja) {
      throw new NotFoundException('Loja não encontrada');
    }

    if (loja.usuarioId === usuarioId) {
      throw new BadRequestException('Você não pode avaliar sua própria loja');
    }

    try {
      return await this.prisma.avaliacaoLoja.create({
        data: {
          usuarioId,
          lojaId: data.lojaId,
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
        throw new ConflictException('Você já avaliou esta loja');
      }
      throw error;
    }
  }

  async findAll(lojaId?: number, usuarioId?: number) {
    return this.prisma.avaliacaoLoja.findMany({
      where: {
        ...(lojaId ? { lojaId } : {}),
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
    const avaliacao = await this.prisma.avaliacaoLoja.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
      },
    });
    if (!avaliacao) {
      throw new NotFoundException('Avaliação da loja não encontrada');
    }
    return avaliacao;
  }

  async update(id: number, data: UpdateAvaliacaoLojaDto, usuarioId: number) {
    const avaliacao = await this.findOne(id);
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        'Você só pode editar suas próprias avaliações',
      );
    }

    return this.prisma.avaliacaoLoja.update({
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

    return this.prisma.avaliacaoLoja.delete({
      where: { id },
    });
  }
}
