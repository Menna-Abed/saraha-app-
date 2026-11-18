import * as identityRequestRepository from '../repository/identity-request.repository.js';
import * as messageRepository from '../../message/repository/message.repository.js';
import * as conversationRepository from '../../conversation/repository/conversation.repository.js';
import { AppError } from '../../../lib/error/error.js';
import {
    identityRequestNotFound,
    identityRequestAlreadyHandled,
    notRequestOwner,
    identityRequestAlreadyExists,
} from '../errors.js';


export async function requestIdentity(messageId, requestedBy) {
    // 1. find the message
    const message = await messageRepository.findMessageById(messageId);
    if (!message) throw new AppError('Message not found', 404);

    // 2. only the receiver can request the sender identity
    if (message.receiver.toString() !== requestedBy) {
        throw new AppError('Only the receiver can request sender identity', 403);
    }

    // 3. message must have a sender (anonymous messages still store sender internally)
    if (!message.sender) {
        throw new AppError('This message has no sender to reveal', 400);
    }

    // 4. check for duplicate request
    const existing = await identityRequestRepository.findExistingRequest(messageId, requestedBy);
    if (existing) throw identityRequestAlreadyExists;

    // 5. create identity request
    return await identityRequestRepository.createIdentityRequest({
        message: messageId,
        requestedBy: requestedBy,
        requestedFrom: message.sender,
        status: 'pending',
    });
}


export async function getMyRequests(userId) {
    return await identityRequestRepository.findIdentityRequestsByUser(userId);
}


export async function respondToRequest(requestId, action, userId) {
    // 1. find request
    const request = await identityRequestRepository.findIdentityRequestById(requestId);
    if (!request) throw identityRequestNotFound;

    // 2. only the original sender can respond
    if (request.requestedFrom.toString() !== userId) throw notRequestOwner;

    // 3. check not already handled
    if (request.status !== 'pending') throw identityRequestAlreadyHandled;

    // 4. update status
    const updatedRequest = await identityRequestRepository.updateIdentityRequestStatus(requestId, action);

    // 5. if accepted, create conversation
    if (action === 'accepted') {
        const conversation = await conversationRepository.createConversation({
            participants: [request.requestedFrom, request.requestedBy],
            originalMessage: request.message,
        });
        return { request: updatedRequest, conversation };
    }

    return { request: updatedRequest };
}
