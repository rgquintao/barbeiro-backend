import {getRepository} from "typeorm";
import uploadConfig from "../config/upload";
import User from "../models/Users";
import path from "path";
import fs from "fs";
import AppError from "../errors/AppError";

interface Request{
    user_id: string;
    avatarFilename: string;
}

class UpdateuserAvatarService{
    public async execute({user_id, avatarFilename}: Request): Promise<User>{
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if(!user){
            throw new AppError("Apenas usuários autenticados podem mudar o avatar!", 401);
        }

        if(user.avatar){
            // Deletar avatar anterior
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await usersRepository.save(user);

        return user;
    };
}

export default UpdateuserAvatarService;