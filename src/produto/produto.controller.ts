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
import { AddProdutoImagensDto, ReorderProdutoImagensDto, UpdateProdutoImagemDto } from './dto/produto-imagem.dto';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      dest: uploadsDir,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
        callback(permitidos.includes(file.mimetype) ? null : new BadRequestException('Use imagens JPG, PNG ou WebP.'), permitidos.includes(file.mimetype));
      },
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

  @Get(':id/imagens')
  findImages(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findImages(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/imagens')
  addImages(@Param('id', ParseIntPipe) id: number, @Body() dto: AddProdutoImagensDto, @Req() req: any) {
    return this.produtoService.addImages(id, dto.urls, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/imagens/reordenar')
  reorderImages(@Param('id', ParseIntPipe) id: number, @Body() dto: ReorderProdutoImagensDto, @Req() req: any) {
    return this.produtoService.reorderImages(id, dto.imagens, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':produtoId/imagens/:imagemId')
  updateImage(@Param('produtoId', ParseIntPipe) produtoId: number, @Param('imagemId', ParseIntPipe) imagemId: number, @Body() dto: UpdateProdutoImagemDto, @Req() req: any) {
    return this.produtoService.updateImage(produtoId, imagemId, dto.urlImagem, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':produtoId/imagens/:imagemId')
  removeImage(@Param('produtoId', ParseIntPipe) produtoId: number, @Param('imagemId', ParseIntPipe) imagemId: number, @Req() req: any) {
    return this.produtoService.removeImage(produtoId, imagemId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProdutoDto, @Req() req: any) {
    return this.produtoService.update(id, dto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.produtoService.remove(id, req.user.userId);
  }
}
