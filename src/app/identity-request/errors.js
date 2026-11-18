import { AppError } from '../../../lib/error/error.js';

export const identityRequestNotFound = new AppError('Identity request not found', 404);
export const identityRequestAlreadyHandled = new AppError('Identity request already handled', 400);
export const notRequestOwner = new AppError('You are not authorized to respond to this request', 403);
export const identityRequestAlreadyExists = new AppError('Identity request already exists for this message', 400);
