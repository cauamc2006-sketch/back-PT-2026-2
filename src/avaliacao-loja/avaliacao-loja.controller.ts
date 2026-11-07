import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Controller('avaliacao-loja')
export class AvaliacaoLojaController {
  constructor(private readonly avaliacaoLojaService: AvaliacaoLojaService) {}

  @Post()
  create(@Body() data: CreateAvaliacaoLojaDto) {
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
  update(@Param('id') id: string, @Body() data: UpdateAvaliacaoLojaDto) {
    return this.avaliacaoLojaService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id:number) {
    return this.avaliacaoLojaService.remove(Number(id));
  }
}
