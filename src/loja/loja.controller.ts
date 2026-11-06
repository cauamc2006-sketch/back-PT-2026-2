import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

@Controller('loja')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createLojaDto: CreateLojaDto, @Req() req: any) {
    return this.lojaService.create(createLojaDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.lojaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lojaService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLojaDto: UpdateLojaDto, @Req() req: any) {
    return this.lojaService.update(+id, updateLojaDto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.lojaService.remove(+id, req.user.userId);
  }
}
