import { IdentityRequest } from '../model/identity-request.model.js';

export async function createIdentityRequest(data) {
    return await IdentityRequest.create(data);
}

export async function findIdentityRequestById(id) {
    return await IdentityRequest.findById(id);
}

export async function findIdentityRequestsByUser(userId) {
    return await IdentityRequest.find({ requestedFrom: userId })
        .populate({ path: 'message', select: 'content receiver createdAt' })
        .populate({ path: 'requestedBy', select: 'name' });
}

export async function updateIdentityRequestStatus(id, status) {
    return await IdentityRequest.findByIdAndUpdate(
        id,
        { status: status },
        { returnDocument: 'after' }
    );
}

export async function findExistingRequest(messageId, requestedBy) {
    return await IdentityRequest.findOne({ message: messageId, requestedBy: requestedBy });
}
