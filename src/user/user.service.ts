import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  //vetor testando "banco de dados do prisma"

  private users: User[] = [];
  private idCounter = 1;

  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: this.idCounter++,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if(userIndex === -1) throw new NotFoundException('Usuário não encontrado');
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  remove(id: number) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if(userIndex === -1) throw new NotFoundException('Usuário não encontrado');

    const deletedUser = this.users.splice(userIndex, 1);
    return deletedUser[0];
  }
}
