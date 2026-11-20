import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsUrl, MaxLength, Min, ValidateNested } from 'class-validator';

export class AddProdutoImagensDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsUrl({ require_tld: false }, { each: true })
  @MaxLength(255, { each: true })
  urls: string[];
}

export class UpdateProdutoImagemDto {
  @IsUrl({ require_tld: false })
  @MaxLength(255)
  urlImagem: string;
}

export class ProdutoImagemOrdemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ordem: number;
}

export class ReorderProdutoImagensDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => ProdutoImagemOrdemDto)
  imagens: ProdutoImagemOrdemDto[];
}
