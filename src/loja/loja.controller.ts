import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { renameSync } from 'fs';
import { extname, join } from 'path';
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

const uploadsDir = join(process.cwd(), 'uploads');

@Controller('loja')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      dest: uploadsDir,
    }),
  )
  uploadImagens(
    @UploadedFiles() files: Array<{ filename: string; originalname: string }>,
    @Req() req: { protocol: string; get: (name: string) => string | undefined },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhuma imagem enviada.');
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return {
      urls: files.map((file) => {
        const ext = extname(file.originalname);
        const filenameComExtensao = `${file.filename}${ext}`;
        if (ext) {
          renameSync(join(uploadsDir, file.filename), join(uploadsDir, filenameComExtensao));
        }
        return `${baseUrl}/uploads/${filenameComExtensao}`;
      }),
    };
  }

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
