import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio' })
    username: string;


    @IsString()
    @IsNotEmpty({ message: 'O nome não pode estar vazio' })
    name: string;

    @IsEmail({}, { message: 'Forneça um e-mail válido' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    senha: string;
}
