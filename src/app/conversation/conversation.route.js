import { Router } from 'express';
import * as conversationController from './controller/conversation.controller.js';
import { authGuard } from '../../lib/auth/authGuard.js';

const conversationRouter = Router();

conversationRouter.post('/send', authGuard, conversationController.sendMessage);
conversationRouter.get('/:conversationId/messages', authGuard, conversationController.getMessages);

export default conversationRouter;
