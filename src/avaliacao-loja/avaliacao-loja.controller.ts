import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { avaliacaoLojaDto } from './avaliacao-loja.dto';

@Controller('avaliacao-loja')
export class AvaliacaoLojaController {
  constructor(private readonly avaliacaoLojaService: AvaliacaoLojaService) {}

  @Post()
  create(@Body() data: avaliacaoLojaDto) {
    return this.avaliacaoLojaService.create(data);
  }

  @Get()
  async findAll() {
    return this.avaliacaoLojaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avaliacaoLojaService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: avaliacaoLojaDto) {
    return this.avaliacaoLojaService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id:number) {
    return this.avaliacaoLojaService.remove(Number(id));
  }
}
