import { model, Schema } from 'mongoose';

const conversationMessageSchema = new Schema(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 500,
            trim: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

export const ConversationMessage = model('ConversationMessage', conversationMessageSchema);
