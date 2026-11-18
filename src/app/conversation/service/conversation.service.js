import * as conversationRepository from '../repository/conversation.repository.js';
import { conversationNotFound, notConversationParticipant } from '../errors.js';


export async function sendMessage(conversationId, senderId, content) {
    // 1. find conversation
    const conversation = await conversationRepository.findConversationById(conversationId);
    if (!conversation) throw conversationNotFound;

    // 2. check sender is participant
    const isParticipant = conversation.participants.some(
        (p) => p.toString() === senderId
    );
    if (!isParticipant) throw notConversationParticipant;

    // 3. create message
    return await conversationRepository.createConversationMessage({
        conversation: conversationId,
        sender: senderId,
        content: content,
    });
}


export async function getMessages(conversationId, userId) {
    // 1. find conversation
    const conversation = await conversationRepository.findConversationById(conversationId);
    if (!conversation) throw conversationNotFound;

    // 2. check user is participant
    const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
    );
    if (!isParticipant) throw notConversationParticipant;

    // 3. get messages
    return await conversationRepository.getConversationMessages(conversationId);
}
