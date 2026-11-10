import { Module } from '@nestjs/common';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { AvaliacaoProdutoController } from './avaliacao-produto.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AvaliacaoProdutoController],
  providers: [AvaliacaoProdutoService],
  exports: [AvaliacaoProdutoService],
})
export class AvaliacaoProdutoModule {}
