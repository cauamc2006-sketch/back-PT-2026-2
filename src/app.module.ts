import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LojaModule } from './loja/loja.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, LojaModule],
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ComentariosModule],
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ProdutoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
