import { validateBody } from '../../../lib/validation/validation.js';
import * as conversationService from '../service/conversation.service.js';
import { sendConversationMessageDto } from '../dto/conversation.dto.js';


export async function sendMessage(req, res, next) {
    try {
        const data = validateBody(sendConversationMessageDto, req.body);
        const { conversationId, content } = data;
        const message = await conversationService.sendMessage(conversationId, req.user.id, content);
        res.status(201).json({
            message: 'Message sent successfully',
            success: true,
            data: message,
        });
    } catch (error) {
        next(error);
    }
}


export async function getMessages(req, res, next) {
    try {
        const conversationId = req.params.conversationId;
        const messages = await conversationService.getMessages(conversationId, req.user.id);
        res.json({
            message: 'OK',
            success: true,
            data: messages,
        });
    } catch (error) {
        next(error);
    }
}
