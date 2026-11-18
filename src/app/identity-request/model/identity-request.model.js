import { model, Schema } from 'mongoose';

const identityRequestSchema = new Schema(
    {
        message: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
        },
        requestedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        requestedFrom: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    }
);

export const IdentityRequest = model('IdentityRequest', identityRequestSchema);
