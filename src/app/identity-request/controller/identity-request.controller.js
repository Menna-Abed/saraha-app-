import { validateBody } from '../../../lib/validation/validation.js';
import * as identityRequestService from '../service/identity-request.service.js';
import { requestIdentityDto, respondIdentityRequestDto } from '../dto/identity-request.dto.js';


export async function requestIdentity(req, res, next) {
    try {
        const data = validateBody(requestIdentityDto, req.body);
        const { messageId } = data;
        const result = await identityRequestService.requestIdentity(messageId, req.user.id);
        res.status(201).json({
            message: 'Identity request created successfully',
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}


export async function getMyRequests(req, res, next) {
    try {
        const requests = await identityRequestService.getMyRequests(req.user.id);
        res.json({
            message: 'OK',
            success: true,
            data: requests,
        });
    } catch (error) {
        next(error);
    }
}


export async function respondToRequest(req, res, next) {
    try {
        const data = validateBody(respondIdentityRequestDto, req.body);
        const { requestId, action } = data;
        const result = await identityRequestService.respondToRequest(requestId, action, req.user.id);
        res.json({
            message: `Identity request ${action} successfully`,
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}
