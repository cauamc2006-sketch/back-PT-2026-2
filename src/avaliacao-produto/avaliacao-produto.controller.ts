import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';

@Controller('avaliacao-produto')
export class AvaliacaoProdutoController {
  constructor(
    private readonly avaliacaoProdutoService: AvaliacaoProdutoService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: CreateAvaliacaoProdutoDto, @Request() req: any) {
    return this.avaliacaoProdutoService.create(data, req.user.userId);
  }

  @Get()
  findAll(
    @Query('produtoId') produtoId?: string,
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.avaliacaoProdutoService.findAll(
      produtoId ? +produtoId : undefined,
      usuarioId ? +usuarioId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.avaliacaoProdutoService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAvaliacaoProdutoDto,
    @Request() req: any,
  ) {
    return this.avaliacaoProdutoService.update(id, data, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.avaliacaoProdutoService.remove(id, req.user.userId);
  }
}
