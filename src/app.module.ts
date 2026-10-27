import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ProdutosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
