import { User } from '../entities/User';
import {AppDataSource} from "../data-source";
import express, {Request, Response} from 'express';
import {IGetUserForRequest} from "../types/customRequest";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const generateJwt = (id: number, name: string, password: string) => {
    return jwt.sign({id, name, password}, 'secret_key', {expiresIn: '24h'})
}
const userRepository = AppDataSource.getRepository(User);
const userRouter = express.Router()
userRouter.post('/register', async (req: Request, res: Response) => {
    try{
        const {name, password} = req.body
        if (!name){
            return res.status(400).json({ error: 'Некорректное имя' });
        }
        if (!password){
            return res.status(400).json({ error: 'Некорректный пароль' });
        }
        const candidate = await userRepository.findOne({where: {name}})
        if (candidate) {
            return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        }
        const hashPassword = await  bcrypt.hash(password, 5)
        const user = await userRepository.create({ name, password: hashPassword });
        await userRepository.save(user);
        const token = generateJwt(user.id, user.name, password)
        return res.json({token})
    }catch (error) {
        return res.status(500).json({ error: `Ошибка при создании пользователя. Подробнее ${error}` });
    }
});
userRouter.post('/login', async (req: Request, res: Response) => {
        try {
            const {name, password} = req.body
            const users = await userRepository.find({where: {name}})
            const user = users[0]
            if (!user) {
                return res.status(400).json({ error: 'Такого пользователя не существует' })
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword){
                return res.status(400).json({ error: 'Неверный пароль' });
            }
            const token = generateJwt(user.id, user.name, password)
            return res.json({token})
        }catch (error) {
            return res.status(500).json({error: `Ошибка при авторизации. Подробнее: ${error}`});
        }
})
userRouter.post('/auth', async (req: IGetUserForRequest, res: Response) => {
    const token = generateJwt(req.user.id, req.user.name, req.user.password)
    return res.json({token})
})
export default userRouter