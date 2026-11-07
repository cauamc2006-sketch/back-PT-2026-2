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
import { AvaliacaoLojaService } from './avaliacao-loja.service';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Controller('avaliacao-loja')
export class AvaliacaoLojaController {
  constructor(private readonly avaliacaoLojaService: AvaliacaoLojaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: CreateAvaliacaoLojaDto, @Request() req: any) {
    return this.avaliacaoLojaService.create(data, req.user.userId);
  }

  @Get()
  findAll(
    @Query('lojaId') lojaId?: string,
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.avaliacaoLojaService.findAll(
      lojaId ? +lojaId : undefined,
      usuarioId ? +usuarioId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.avaliacaoLojaService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAvaliacaoLojaDto,
    @Request() req: any,
  ) {
    return this.avaliacaoLojaService.update(id, data, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.avaliacaoLojaService.remove(id, req.user.userId);
  }
}
