import {validateBody} from "../../../lib/validation/validation.js";
import * as messageService from "../service/message.service.js";
import {sendMessageDto} from "../dto/message.dto.js";

export async function sendMessage(req, res, next) {
    try {
        // validate data
        const data = validateBody(sendMessageDto, req.body);
        const { content, receiver } = data;
        const sender = req.user?.id;
        const createdMessage= await messageService.sendMessage(content, receiver, sender);
        console.log("Returned Message:", createdMessage);
        res.status(200).json({
            message: 'Message sent successfully',
            success: true,
            data: createdMessage,
        })
    } catch (error) {
        next(error);
    }
}



export async function getAllMessages(req, res, next) {
    try {
        const messages = await messageService.getAllMessages(req.user.id);
        res.json({
            message: "OK",
            success: true,
            data: messages,
        });
    } catch (error) {
        next(error);
    }
}