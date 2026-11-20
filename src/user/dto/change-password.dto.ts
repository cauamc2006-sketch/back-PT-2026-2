import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  senhaAtual: string;

  @IsString()
  @MinLength(8)
  novaSenha: string;
}
