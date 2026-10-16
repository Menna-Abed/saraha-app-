import { z } from 'zod';
import { Types } from "mongoose";

export const sendMessageDto = z.object({
    content: z.string().trim().min(2).max(100),
    receiver: z.string().trim().refine((val) => {
        return Types.ObjectId.isValid(val); // length >> 24 and 0-9 | a-f
    }),
});