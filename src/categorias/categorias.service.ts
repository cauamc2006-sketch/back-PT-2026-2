import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  // "Eletrônicos & Games" -> "eletronicos-games"
  private gerarSlug(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async validarCategoriaPai(categoriaPaiId: number, idAtual?: number) {
    if (idAtual !== undefined && categoriaPaiId === idAtual) {
      throw new BadRequestException('Uma categoria não pode ser pai dela mesma');
    }
    const pai = await this.prisma.categoria.findUnique({
      where: { id: categoriaPaiId },
    });
    if (!pai) throw new NotFoundException('Categoria pai não encontrada');

    // evita ciclos: sobe a hierarquia a partir do pai
    if (idAtual !== undefined) {
      let atual = pai.categoriaPaiId;
      while (atual !== null) {
        if (atual === idAtual) {
          throw new BadRequestException(
            'Hierarquia inválida: a categoria pai é descendente desta categoria',
          );
        }
        const proxima = await this.prisma.categoria.findUnique({
          where: { id: atual },
        });
        atual = proxima ? proxima.categoriaPaiId : null;
      }
    }
  }

  private tratarErroPrisma(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Já existe uma categoria com esse slug');
    }
    throw error;
  }

  async create(dto: CreateCategoriaDto) {
    const slug = dto.slug ?? this.gerarSlug(dto.nome);
    if (!slug) {
      throw new BadRequestException('Não foi possível gerar um slug a partir do nome');
    }
    if (dto.categoriaPaiId !== undefined) {
      await this.validarCategoriaPai(dto.categoriaPaiId);
    }

    try {
      return await this.prisma.categoria.create({
        data: {
          nome: dto.nome,
          slug,
          descricao: dto.descricao,
          imagemUrl: dto.imagemUrl,
          categoriaPaiId: dto.categoriaPaiId,
        },
      });
    } catch (error) {
      this.tratarErroPrisma(error);
    }
  }

  // sem filtro retorna todas; ?categoriaPaiId=1 lista as subcategorias; ?raiz=true só as de topo
  findAll(categoriaPaiId?: number, raiz?: boolean) {
    return this.prisma.categoria.findMany({
      where: raiz ? { categoriaPaiId: null } : { categoriaPaiId },
      orderBy: { nome: 'asc' },
      include: { subcategorias: true },
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { categoriaPai: true, subcategorias: true },
    });
    if (!categoria) throw new NotFoundException('Categoria não encontrada');
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOne(id);

    if (dto.categoriaPaiId !== undefined) {
      await this.validarCategoriaPai(dto.categoriaPaiId, id);
    }

    try {
      return await this.prisma.categoria.update({
        where: { id },
        data: {
          nome: dto.nome,
          slug: dto.slug,
          descricao: dto.descricao,
          imagemUrl: dto.imagemUrl,
          categoriaPaiId: dto.categoriaPaiId,
        },
      });
    } catch (error) {
      this.tratarErroPrisma(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    const produtos = await this.prisma.produto.count({
      where: { categoriaId: id },
    });
    if (produtos > 0) {
      throw new ConflictException(
        'Não é possível remover: existem produtos nesta categoria',
      );
    }

    // as subcategorias ficam sem pai (onDelete: SetNull no schema)
    return this.prisma.categoria.delete({ where: { id } });
  }
}
