import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Injectable()
export class ComentariosService {
  constructor(private readonly prisma: PrismaService) {}

  // o usuarioId vem de fora (token, ou body temporariamente)
  async create(dto: CreateComentarioDto, usuarioId: number) {
    const { avaliacaoLojaId, avaliacaoProdutoId, conteudo } = dto;

    // exige exatamente um dos dois IDs (tipo um xor)
    if (!!avaliacaoLojaId === !!avaliacaoProdutoId) {
      throw new BadRequestException(
        'Informe avaliacaoLojaId OU avaliacaoProdutoId (apenas um)',
      );
    }

    // verifica se a avaliação referenciada existe
    if (avaliacaoLojaId) {
      const avaliacao = await this.prisma.avaliacaoLoja.findUnique({
        where: { id: avaliacaoLojaId },
      });
      if (!avaliacao) throw new NotFoundException('Avaliação de loja não encontrada');
    } else {
      const avaliacao = await this.prisma.avaliacaoProduto.findUnique({
        where: { id: avaliacaoProdutoId },
      });
      if (!avaliacao) throw new NotFoundException('Avaliação de produto não encontrada');
    }

    return this.prisma.comentarioAvaliacao.create({
      data: { conteudo, usuarioId, avaliacaoLojaId, avaliacaoProdutoId },
    });
  }

  findAll(avaliacaoLojaId?: number, avaliacaoProdutoId?: number) {
    return this.prisma.comentarioAvaliacao.findMany({
      where: { avaliacaoLojaId, avaliacaoProdutoId },
    });
  }

  async findOne(id: number) {
    const comentario = await this.prisma.comentarioAvaliacao.findUnique({
      where: { id },
    });
    if (!comentario) throw new NotFoundException('Comentário não encontrado');
    return comentario;
  }

  async update(id: number, dto: UpdateComentarioDto, usuarioId: number) {
    const comentario = await this.findOne(id);
    if (comentario.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você só pode editar seus próprios comentários');
    }
    return this.prisma.comentarioAvaliacao.update({
      where: { id },
      data: { conteudo: dto.conteudo },
    });
  }

  async remove(id: number, usuarioId: number) {
    const comentario = await this.findOne(id);
    if (comentario.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você só pode remover seus próprios comentários');
    }
    return this.prisma.comentarioAvaliacao.delete({ where: { id } });
  }
}
