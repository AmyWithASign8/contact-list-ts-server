import * as jwt from 'jsonwebtoken'
import {Response} from "express";
import {IGetUserForRequest} from "../types/customRequest";

interface ExpectedUser {
    id: number;
    name: string;
    password: string;
}

export function jwtAuthMiddleware(req: IGetUserForRequest, res: Response, next){
    try{
        const token = req.headers.authorization.split(' ')[1]
        if (!token){
            res.status(401).json({message: "Пользователь не авторизован"})
        }
        const decoded = jwt.verify(token, 'secret_key') as ExpectedUser;
        if (decoded && typeof decoded === 'object') {
            req.user = decoded;
        } else {
            throw new Error('Ошибка при декодировании пользователя');
        }
        next()
    }catch (error){
        res.status(401).json({message: `Пользователь не авторизован. Подробнее ${error}`})
    }
}