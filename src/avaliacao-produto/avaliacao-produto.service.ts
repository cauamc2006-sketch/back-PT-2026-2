import { Injectable } from '@nestjs/common';
import { avaliacaoProdutoDto } from './avaliacao-produto.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AvaliacaoProdutoService {
  constructor(private prisma: PrismaService) { }

  async create(data: avaliacaoProdutoDto) {

    const avaliacaoProduto = await this.prisma.avaliacaoProduto.create({
      data
    });
    return avaliacaoProduto;
  }

  async findAll() {
    return this.prisma.avaliacaoProduto.findMany();
  }

  async findOne(id: number) {
    return this.prisma.avaliacaoProduto.findUnique({
      where: { id }
    });
  }

  async update(id: number, data: avaliacaoProdutoDto) {
    const avaliacaoProdutoExiste = await this.prisma.avaliacaoProduto.findUnique({
      where: { id }
    });
    if (!avaliacaoProdutoExiste) {
      throw new Error("Avaliação do produto não encontrada");
    }
    return await this.prisma.avaliacaoProduto.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    return this.prisma.avaliacaoProduto.delete({
      where: { id }
    });
  }
}
