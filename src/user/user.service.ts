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
    const { senhaHash, ...usuarioSemSenha } = newUser;
    return usuarioSemSenha;
  }

  async findAll() {
    const users = await this.prisma.usuario.findMany();
    return users.map(user => {
      const { senhaHash, ...usuarioSemSenha } = user;
      return usuarioSemSenha;
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });
    if(!user) throw new NotFoundException('Usuário não encontrado');
    
    const { senhaHash, ...usuarioSemSenha } = user;
    return usuarioSemSenha;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const dadosParaAtualizar: any = {
      username: updateUserDto.username,
        nome: updateUserDto.name,
        email: updateUserDto.email,
    };

    if (updateUserDto.senha) {
      const salt = await bcrypt.genSalt()
      dadosParaAtualizar.senhaHash = await bcrypt.hash(updateUserDto.senha, salt);
    }
    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id },
      data: dadosParaAtualizar,
    });

// coloca a senhaHash em uma variável e guarda o resto no "usuarioSemSenha"
    const { senhaHash, ...usuarioSemSenha } = usuarioAtualizado;

    // retorna o objeto limpo
    return usuarioSemSenha;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
