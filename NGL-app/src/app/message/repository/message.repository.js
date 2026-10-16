import { Message } from "../model/message.model.js";

export async function createMessage(content, receiver, sender) {
    return await Message.create({
        content: content,
        sender: sender, // undefined
        receiver: receiver,
    });
}



export async function getAllMessages(userId) {
    return  Message.find(
        {
            receiver: userId,
        },
        {},
        { populate: { path: "sender" , select: "name" } }
    );
}