import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacaoLojaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lojaId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  nota: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}
