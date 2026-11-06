import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateComentarioDto {
    @IsString()
    @IsNotEmpty()
    conteudo: string;

    @IsOptional()
    @IsInt()
    avaliacaoLojaId?: number;
    
    @IsOptional()
    @IsInt()
    avaliacaoProdutoId?: number;

}
