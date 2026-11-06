import { Injectable } from '@nestjs/common';
import { avaliacaoLojaDto } from './avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AvaliacaoLojaService {
  constructor(private prisma: PrismaService) { }
  
  async create(data: avaliacaoLojaDto) {
    const avaliacaoLoja = this.prisma.avaliacaoLoja.create({
      data
    });
    return avaliacaoLoja;
  }

  async findAll() {
    return this.prisma.avaliacaoLoja.findMany();
  }

  async findOne(id: number) {
    return this.prisma.avaliacaoLoja.findUnique({
      where: { id }
    });
  }

  async update(id: number, data: UpdateAvaliacaoLojaDto) {
    const avaliacaoLojaExiste = await this.prisma.avaliacaoLoja.findUnique({
      where: { id }
    });
    if (!avaliacaoLojaExiste) {
      throw new Error("Avaliação da loja não encontrada");
    }
    return await this.prisma.avaliacaoLoja.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    return await this.prisma.avaliacaoLoja.delete({
      where: { id }
    });
  }
}
