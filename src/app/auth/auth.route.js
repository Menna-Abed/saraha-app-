import {Router} from "express";
import * as authController from "./controller/auth.controller.js";
import {idempotency} from "../../lib/idempotency/idempotency.js";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.patch('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.patch('/reset-password',idempotency() ,authController.resetPassword);
authRouter.post('/login-with-google', authController.loginWithGoogle);
authRouter.post('/refresh-token', authController.refreshToken); 
authRouter.post('/enable-2-step-verification', authController.enable2StepVerification);
authRouter.post('/verify-code-active-two-step-verification', authController.verifyCodeActiveTwoStepVerification);
authRouter.post('/verify-code-two-step-verification', authController.verifyCodeTwoStepVerification);
export default authRouter;