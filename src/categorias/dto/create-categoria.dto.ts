import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @MaxLength(100)
  nome: string;

  // Opcional: se não for enviado, é gerado a partir do nome
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagemUrl?: string;

  @IsOptional()
  @IsInt()
  categoriaPaiId?: number;
}
