import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface TolenPayload{
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
    ): void{
        // Realizar a validação do token JWT

        const authHeader = request.headers.authorization;

        if(!authHeader){
            throw new AppError("Token JWT está faltando!", 401);
        }

        // Beared Token
        // separar o Beread do Token

        const [, token] = authHeader.split(" ");

        try{
            const decoded = verify(token, authConfig.jwt.secret);

            const {sub} = decoded as TolenPayload;

            request.user = {
                id: sub,
            }
            
            return next();
        } catch {
            throw new AppError("Token JWT inválido!", 401);
        }
        


    }