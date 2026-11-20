import { IsString, IsNotEmpty, IsOptional, IsInt, MaxLength, Min } from 'class-validator';

export class CreateComentarioDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    conteudo: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    avaliacaoLojaId?: number;
    
    @IsOptional()
    @IsInt()
    @Min(1)
    avaliacaoProdutoId?: number;

}
