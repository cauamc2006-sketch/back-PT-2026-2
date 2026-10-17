import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async validarLogin(email: string, senhaPlana: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        
        const senhaValida = await bcrypt.compare(senhaPlana, user.senhaHash);
        if(!senhaValida){
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        return {
            mensagem: 'Login realizado com sucesso!',
            token: 'fake-jwt-token-123456',
            userId: user.id
        };
    }
}
