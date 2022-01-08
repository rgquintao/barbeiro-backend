import { compare } from "bcryptjs";
import { getRepository } from "typeorm";
import User from "../models/Users"
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";
import { request } from "express";

interface Request{
    email: string;
    password: string;
}

interface Response{
    user: User,
    token: string
}



class AuthenticateUserService{
    public async execute({email, password}: Request): Promise<Response>{
        const usersRepository = getRepository(User);
        const user = await usersRepository.findOne({where: {email}});

        if(!user){
            throw new AppError("Email ou Senha inválidos!", 401);
        }

        // user.password = Senha criptografada no Banco de Dados
        // password = Senha não=criptografada

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched){
            throw new AppError("Email ou Senha inválidos!", 401);
        }

        // Usuário autenticado

        // sign ({payloaf}, "chave secreta", {configurações do token})
        //
        // chave secreta -> pode ser qualquer coisa, mas é aconselhável buscar uma chave
        //                  de maior complexidade, por exemplo usando o site "md5 online"
        //                  que ele criará um hash para usarmos.
        
        const {secret, expiresIn} = authConfig.jwt;
        
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user, 
            token,
        };

    }
}

export default AuthenticateUserService;