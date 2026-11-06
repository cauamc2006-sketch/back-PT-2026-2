import { PartialType } from '@nestjs/mapped-types';
import { CreateAvaliacaoProdutoDto } from './create-avaliacao-produto.dto';

export class UpdateAvaliacaoProdutoDto extends PartialType(CreateAvaliacaoProdutoDto) {}
