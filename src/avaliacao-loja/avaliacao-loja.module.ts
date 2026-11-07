import { Module } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { AvaliacaoLojaController } from './avaliacao-loja.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AvaliacaoLojaController],
  providers: [AvaliacaoLojaService],
  exports: [AvaliacaoLojaService],
})
export class AvaliacaoLojaModule {}
