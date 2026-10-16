import * as userRepository from '../../user/repository/user.repository.js';
import { userNotExist } from "../../user/errors.js";
import * as messageRepository from '../repository/message.repository.js';
import {AppError} from "../../../lib/error/error.js";


export async function sendMessage(content, receiver, sender) {
    // 1. check receiver exists
    const user = await userRepository.findUserById(receiver);
    if (!user) throw userNotExist;

    // 2. save message into Db
    return await messageRepository.createMessage(content, receiver, sender);
}


export async function getAllMessages(userId) {
    const messages = await messageRepository.getAllMessages(userId); // [{},{},{}] | []
    if (messages.length === 0) throw new AppError('no message found', 404);
    return messages;
}