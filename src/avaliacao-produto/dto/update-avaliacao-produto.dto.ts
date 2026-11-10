import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateAvaliacaoProdutoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  nota?: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}
