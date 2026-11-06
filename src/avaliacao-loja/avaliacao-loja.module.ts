import { Module } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [AvaliacaoLojaController],
  providers: [AvaliacaoLojaService, PrismaService],
})
export class AvaliacaoLojaModule {}
