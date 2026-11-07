import { Injectable, NotFoundException } from '@nestjs/common';
import { AvaliacaoProdutoDto } from './avaliacao-produto.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvaliacaoProdutoService {
  constructor(private prisma: PrismaService) { }

  async create(data: AvaliacaoProdutoDto) {
    const avaliacaoProduto = await this.prisma.avaliacaoProduto.create({
      data,
    });
    return avaliacaoProduto;
  }

  async findAll() {
    return this.prisma.avaliacaoProduto.findMany();
  }

  async findOne(id: number) {
    return this.prisma.avaliacaoProduto.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<AvaliacaoProdutoDto>) {
    const avaliacaoProdutoExiste = await this.prisma.avaliacaoProduto.findUnique({
      where: { id },
    });
    if (!avaliacaoProdutoExiste) {
      throw new NotFoundException('Avaliação do produto não encontrada');
    }
    return await this.prisma.avaliacaoProduto.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const avaliacaoProdutoExiste = await this.prisma.avaliacaoProduto.findUnique({
      where: { id },
    });
    if (!avaliacaoProdutoExiste) {
      throw new NotFoundException('Avaliação do produto não encontrada');
    }
    return this.prisma.avaliacaoProduto.delete({
      where: { id },
    });
  }
}
