import { Injectable, NotFoundException } from '@nestjs/common';
import { AvaliacaoLojaDto } from './avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvaliacaoLojaService {
  constructor(private prisma: PrismaService) { }

  async create(data: AvaliacaoLojaDto) {
    const avaliacaoLoja = await this.prisma.avaliacaoLoja.create({
      data,
    });
    return avaliacaoLoja;
  }

  async findAll() {
    return this.prisma.avaliacaoLoja.findMany();
  }

  async findOne(id: number) {
    return this.prisma.avaliacaoLoja.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateAvaliacaoLojaDto) {
    const avaliacaoLojaExiste = await this.prisma.avaliacaoLoja.findUnique({
      where: { id },
    });
    if (!avaliacaoLojaExiste) {
      throw new NotFoundException('Avaliação da loja não encontrada');
    }
    return await this.prisma.avaliacaoLoja.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const avaliacaoLojaExiste = await this.prisma.avaliacaoLoja.findUnique({
      where: { id },
    });
    if (!avaliacaoLojaExiste) {
      throw new NotFoundException('Avaliação da loja não encontrada');
    }
    return await this.prisma.avaliacaoLoja.delete({
      where: { id },
    });
  }
}
