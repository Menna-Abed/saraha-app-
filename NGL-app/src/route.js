import {Router} from 'express';
import authRouter from "./app/auth/auth.route.js";
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";
export const router = Router();




router.use('/auth',authRouter);
router.use('/user',userRouter);
router.use('/message',messageRouter);
