import express from "express";
import userRouter from "./user-route";
import contactsRouter from "./contact-route";

const router = express.Router()

router.use('/user', userRouter);
router.use('/contact', contactsRouter);

export default router