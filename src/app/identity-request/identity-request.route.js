import { Router } from 'express';
import * as identityRequestController from './controller/identity-request.controller.js';
import { authGuard } from '../../lib/auth/authGuard.js';

const identityRequestRouter = Router();

identityRequestRouter.post('/request', authGuard, identityRequestController.requestIdentity);
identityRequestRouter.get('/my-requests', authGuard, identityRequestController.getMyRequests);
identityRequestRouter.patch('/respond', authGuard, identityRequestController.respondToRequest);

export default identityRequestRouter;
