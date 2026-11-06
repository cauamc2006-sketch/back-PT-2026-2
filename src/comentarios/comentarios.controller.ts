import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createDto: CreateComentarioDto,
    @Request() req: any
  ) {
    
    const usuarioId = req.user.userId;

    return await this.comentariosService.create(createDto, usuarioId);
  }

  @Get()
  findAll(
    @Query('avaliacaoLojaId') avaliacaoLojaId?: string,
    @Query('avaliacaoProdutoId') avaliacaoProdutoId?: string,
  ) {
    return this.comentariosService.findAll(
      avaliacaoLojaId ? +avaliacaoLojaId : undefined,
      avaliacaoProdutoId ? +avaliacaoProdutoId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comentariosService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComentarioDto: UpdateComentarioDto,
    @Request() req: any,
  ) {
    return this.comentariosService.update(+id, updateComentarioDto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.comentariosService.remove(+id, req.user.userId);
  }
}
