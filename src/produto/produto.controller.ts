import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { renameSync } from 'fs';
import { extname, join } from 'path';

const uploadsDir = join(process.cwd(), 'uploads');
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
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
  create(@Body() dto: CreateProdutoDto, @Req() req: { user: { userId: number } }) {
    return this.produtoService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Query('lojaId', new ParseIntPipe({ optional: true })) lojaId?: number) {
    return this.produtoService.findAll(lojaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProdutoDto) {
    return this.produtoService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.remove(id);
  }
}
