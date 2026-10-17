import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async validarLogin(email: string, senhaPlana: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        
        const senhaValida = await bcrypt.compare(senhaPlana, user.senhaHash);
        if(!senhaValida){
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        
        const payload = { sub: user.id, email: user.email };
        
        return {
            mensagem: 'Login realizado com sucesso!',
            token: this.jwtService.sign(payload),
            userId: user.id
        };
    }
}
