import { AppError } from '../../../lib/error/error.js';

export const conversationNotFound = new AppError('Conversation not found', 404);
export const notConversationParticipant = new AppError('You are not authorized to access this conversation', 403);
