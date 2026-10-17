import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const senhaCriptografada = await bcrypt.hash(createUserDto.senha, salt);

    const newUser = await this.prisma.usuario.create({
      data: {
        username: createUserDto.username,
        nome: createUserDto.name, // Mapeando 'name' do DTO para 'nome' do banco
        email: createUserDto.email,
        senhaHash: senhaCriptografada,
      },
    });
    return newUser;
  }

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });
    if(!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.usuario.update({
      where: { id },
      data: {
        username: updateUserDto.username,
        nome: updateUserDto.name,
        email: updateUserDto.email,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
