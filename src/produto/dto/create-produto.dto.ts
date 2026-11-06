import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProdutoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lojaId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  estoque: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
