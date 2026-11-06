import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';

export class UpdateComentarioDto extends PartialType(
    PickType(CreateComentarioDto, ['conteudo'] as const)
) {}
