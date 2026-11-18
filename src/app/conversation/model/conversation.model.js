import { model, Schema } from 'mongoose';

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        originalMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    }
);

export const Conversation = model('Conversation', conversationSchema);
