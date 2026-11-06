import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { produtodto } from './produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) { }

  async create(data: produtodto) {
    const produto = await this.prisma.produto.create ({
      data
    })
  return produto;
}
  
  async findAll() {
  return this.prisma.produto.findMany();
}

findOne(id: number) {
  return this.prisma.produto.findUnique({
    where: { id }
  });
}

 async update(id: number, data: produtodto) {
  const produtoexiste = await this.prisma.produto.findUnique({
    where: {id}
  });
  if(!produtoexiste) {
    throw new Error("Produto não encontrado");
  }
  return await this.prisma.produto.update({
    where: {id},
    data
  });
}

async delete(id: number) {
  return this.prisma.produto.delete({
    where: {id}
  });
}
}
  

