import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    validarLogin(email: string, senha: string) {
        const users = this.userService.findAll();
        const user = users.find(u => u.email === email && u.senha === senha);
        if(!user) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        return {
            mensagem: 'Login realizado com sucesso!',
            token: 'fake-jwt-token-123456',
            userId: user.id
        };
    }
}
