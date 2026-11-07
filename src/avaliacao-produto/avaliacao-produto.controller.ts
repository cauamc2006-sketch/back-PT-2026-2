import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';

@Controller('avaliacao-produto')
export class AvaliacaoProdutoController {
  constructor(private readonly avaliacaoProdutoService: AvaliacaoProdutoService) {}

  @Post()
  create(@Body() data: CreateAvaliacaoProdutoDto) {
    return this.avaliacaoProdutoService.create(data);
  }

  @Get()
  async findAll() {
    return this.avaliacaoProdutoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.avaliacaoProdutoService.findOne(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateAvaliacaoProdutoDto) {
    return this.avaliacaoProdutoService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.avaliacaoProdutoService.remove(Number(id));
  }
}
