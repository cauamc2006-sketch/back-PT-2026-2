import { PartialType } from '@nestjs/mapped-types';
import { CreateAvaliacaoLojaDto } from './create-avaliacao-loja.dto';

export class UpdateAvaliacaoLojaDto extends PartialType(CreateAvaliacaoLojaDto) {}
