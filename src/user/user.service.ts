import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    const { senhaHash: _senhaHash, ...usuarioSemSenha } = newUser;
    return usuarioSemSenha;
  }

  async findAll() {
    const users = await this.prisma.usuario.findMany();
    return users.map((user: any) => {
      const { senhaHash: _senhaHash, ...usuarioSemSenha } = user;
      return usuarioSemSenha;
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });
    if(!user) throw new NotFoundException('Usuário não encontrado');
    
    const { senhaHash: _senhaHash, ...usuarioSemSenha } = user;
    return usuarioSemSenha;
  }

  async findProfile(id: number, includeEmail = true) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nome: true,
        ...(includeEmail ? { email: true } : {}),
        fotoPerfilUrl: true,
        lojas: {
          orderBy: { criadoEm: 'desc' },
          include: {
            produtos: {
              orderBy: { criadoEm: 'desc' },
              include: { imagens: { orderBy: { ordem: 'asc' } } },
            },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findPublicProfile(id: number) {
    return this.findProfile(id, false);
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
    try {
      await this.prisma.usuario.update({ where: { id }, data: dadosParaAtualizar });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Username ou e-mail já está em uso');
      }
      throw error;
    }

    return this.findProfile(id);
  }

  async changePassword(id: number, senhaAtual: string, novaSenha: string) {
    if (!senhaAtual || !novaSenha || novaSenha.length < 8) {
      throw new BadRequestException('A senha nova deve ter no mínimo 8 caracteres');
    }
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (!(await bcrypt.compare(senhaAtual, user.senhaHash))) {
      throw new UnauthorizedException('A senha atual está incorreta');
    }
    if (await bcrypt.compare(novaSenha, user.senhaHash)) {
      throw new BadRequestException('A senha nova deve ser diferente da atual');
    }
    const senhaHash = await bcrypt.hash(novaSenha, await bcrypt.genSalt());
    await this.prisma.usuario.update({ where: { id }, data: { senhaHash } });
    return { mensagem: 'Senha alterada com sucesso' };
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
