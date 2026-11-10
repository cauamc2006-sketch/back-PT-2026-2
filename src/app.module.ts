import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LojaModule } from './loja/loja.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { ProdutoModule } from './produto/produto.module';
import { CategoriasModule } from './categorias/categorias.module';
import { AvaliacaoProdutoModule } from './avaliacao-produto/avaliacao-produto.module';
import { AvaliacaoLojaModule } from './avaliacao-loja/avaliacao-loja.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    LojaModule,
    ComentariosModule,
    ProdutoModule,
    CategoriasModule,
    AvaliacaoProdutoModule,
    AvaliacaoLojaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
