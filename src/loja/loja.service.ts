import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LojaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLojaDto: CreateLojaDto, usuarioId: number) {
    return await this.prisma.loja.create({
      data: {
        nome: createLojaDto.nome,
        descricao: createLojaDto.descricao,
        logoUrl: createLojaDto.logoUrl,
        bannerUrl: createLojaDto.bannerUrl,
        stickerUrl: createLojaDto.stickerUrl,
        usuarioId,
      },
    });
  }

  async findAll() {
    return await this.prisma.loja.findMany();
  }

  async findOne(id: number) {
    const loja = await this.prisma.loja.findUnique({
      where: { id },
      include: {
        usuario: true,
      }
    });
    if (!loja) {
      throw new NotFoundException(`Loja não encontrada`);
    }
    return loja;
  }

  async update(id: number, updateLojaDto: UpdateLojaDto, usuarioId: number) {
    const loja = await this.findOne(id);
    if (loja.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para alterar esta loja');
    }
    return await this.prisma.loja.update({
      where: { id },
      data: updateLojaDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    const loja = await this.findOne(id);
    if (loja.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para alterar esta loja');
    }
    return await this.prisma.loja.delete({
      where: { id },
    });
  }
}
