import express, {Request, Response} from "express";
import { Contact } from '../entities/Contact';
import {AppDataSource} from "../data-source";
import {jwtAuthMiddleware} from "../middleware/jwt-auth-middleware";
import {IGetUserForRequest} from "../types/customRequest";

const contactsRouter = express.Router();
const contactRepository = AppDataSource.getRepository(Contact);

contactsRouter.post("/create", jwtAuthMiddleware, async (req: IGetUserForRequest, res: Response) => {
        try {
            const { contact, name } = req.body;
            const user = req.user;

            const profile = await contactRepository.create({ name, contact, userId: user.id});
            await contactRepository.save(profile)

            return res.json({ profile });
        } catch (error) {
            return res.status(500).json({ error: `Ошибка при создании контакта. Подробнее ${error}` });
        }
    }
);

contactsRouter.delete("/delete", jwtAuthMiddleware, async (req: Request, res: Response) => {
    try {
        const { contactId } = req.query;
        if (!contactId)
            return res.status(400).json({ error: `Ошибка при удалении контакта.` });
        const contactToRemove = await contactRepository.findOne({where: {id: Number(contactId)}} )
        if (!contactToRemove)
            return res.status(400).json({ error: `Такого контакта не существует` });
        const deletedContact = await contactRepository.remove(contactToRemove)
        return res.json({ deletedContact });
    } catch (error) {
        return res.status(500).json({ error: `Ошибка при удалении контакта. Подробнее ${error}` });
    }
});

contactsRouter.post("/edit", jwtAuthMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { name, contact, id } = req.body;
            if (!name) {
                return res.status(400).json({ error: `Имя не может быть пустым` });
            }
            if (!contact) {
                return res.status(400).json({ error: `Номер телефона не может быть пустым` });
            }
            const profileToUpdate = await contactRepository.findOne({
                where: {
                    id,
                },
            });
            if (profileToUpdate){
                profileToUpdate.name = name;
                profileToUpdate.contact = contact;
            }
            await contactRepository.save(profileToUpdate);

            return res.status(200).json({message: 'Успешно обновлено'});
        } catch (error) {
            return res.status(500).json({error: `Ошибка при обновлении контакта. Подробнее: ${error}`});
        }
    }
);

contactsRouter.get("/", jwtAuthMiddleware, async (req: IGetUserForRequest, res: Response) => {
    try {
        const user = req.user;

        const contacts = await contactRepository.find({
            where: {
                userId: user.id,
            },
        });

        return res.json({ contacts });
    } catch (error) {
        return res.status(500).json({error: `Ошибка при получении контактов. Подробнее: ${error}`});
    }
});

export default contactsRouter
