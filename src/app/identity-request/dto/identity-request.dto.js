import { z } from 'zod';
import { Types } from 'mongoose';

export const requestIdentityDto = z.object({
    messageId: z.string().trim().refine((val) => {
        return Types.ObjectId.isValid(val);
    }),
});

export const respondIdentityRequestDto = z.object({
    requestId: z.string().trim().refine((val) => {
        return Types.ObjectId.isValid(val);
    }),
    action: z.enum(['accepted', 'rejected']),
});
