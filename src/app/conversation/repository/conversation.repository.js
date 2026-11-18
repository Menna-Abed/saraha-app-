import { Conversation } from '../model/conversation.model.js';
import { ConversationMessage } from '../model/conversation-message.model.js';

export async function createConversation(data) {
    return await Conversation.create(data);
}

export async function findConversationById(id) {
    return await Conversation.findById(id);
}

export async function createConversationMessage(data) {
    return await ConversationMessage.create(data);
}

export async function getConversationMessages(conversationId) {
    return await ConversationMessage.find(
        { conversation: conversationId },
        {},
        { populate: { path: 'sender', select: 'name' }, sort: { createdAt: 1 } }
    );
}
