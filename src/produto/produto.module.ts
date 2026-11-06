import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ProdutoController],
  providers: [ProdutoService, PrismaService],
})
export class ProdutoModule {}
