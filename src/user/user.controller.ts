import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/profile')
  findCurrent(@Req() req: any) {
    return this.userService.findProfile(req.user.userId);
  }

  @Get(':id/profile')
  findPublicProfile(@Param('id') id: string) {
    return this.userService.findPublicProfile(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: any) {
    return this.userService.changePassword(req.user.userId, dto.senhaAtual, dto.novaSenha);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    if (req.user.userId !== +id) {
      throw new ForbiddenException('Não tem permissão para consultar a conta de outro usuário');
    }
    return this.userService.findOne(+id);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    if(req.user.userId !== +id){
      throw new ForbiddenException('Não tem permissão para alterar a conta de outro usuário');
    }
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.userId !== +id){
      throw new ForbiddenException("Não tem permissão para apagar a conta de outro usuário");
    }
    return this.userService.remove(+id);
  }
}
