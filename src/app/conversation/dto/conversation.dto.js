import { z } from 'zod';
import { Types } from 'mongoose';

export const sendConversationMessageDto = z.object({
    conversationId: z.string().trim().refine((val) => {
        return Types.ObjectId.isValid(val);
    }),
    content: z.string().trim().min(1).max(500),
});
