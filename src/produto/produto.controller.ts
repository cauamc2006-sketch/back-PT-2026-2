import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import type { produtodto } from './produto.dto';


@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  create(@Body() data: produtodto) {
    return this.produtoService.create(data);
  }

  @Get()
  async findAll() {
    return this.produtoService.findAll();
  }
 
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.produtoService.findOne(Number(id));
  }

  @Patch(':id')
   async update(@Param('id') id: string, @Body() data: produtodto) {
    return this.produtoService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.produtoService.delete(Number(id));
  }
}
