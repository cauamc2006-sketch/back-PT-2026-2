import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLojaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da loja não pode estar vazio' })
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @IsString()
  @IsOptional()
  stickerUrl?: string;
}
