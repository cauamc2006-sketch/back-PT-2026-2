import { Module } from '@nestjs/common';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { AvaliacaoProdutoController } from './avaliacao-produto.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [AvaliacaoProdutoController],
  providers: [AvaliacaoProdutoService, PrismaService],
})
export class AvaliacaoProdutoModule {}
