import { Router } from "express";
import * as messageController from './controller/message.controller.js';
import {authGuard} from "../../lib/auth/authGuard.js";




const messageRouter = Router();
messageRouter.post('/', messageController.sendMessage);
messageRouter.post('/public',authGuard , messageController.sendMessage);
messageRouter.get('/', authGuard , messageController.getAllMessages);


export default messageRouter;