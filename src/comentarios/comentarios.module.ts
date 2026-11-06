import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
