import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AvaliacaoProdutoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usuarioId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  produtoId: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  nota: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}
