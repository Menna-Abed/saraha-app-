import * as authService from "../service/auth.service.js";
import {toMs} from "../../../pkg/utils/time.js";
import {validateBody} from "../../../lib/validation/validation.js";
import {loginDTO, registerDTO, resetPasswordDTO, sendOTPDto, verifyAccountDTO} from "../dto/auth.dto.js";
import {setCookies} from "../utils.js";

export async function register(req, res, next)   {
    try {
        const data = validateBody(registerDTO, req.body);
        const createdUser = await authService.register(data);
        res.status(201).json({
            message: 'User Created Successfully',
            success: true,
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
}

export async function verifyAccount(req, res, next) {
    try {
        const data = validateBody(verifyAccountDTO, req.body);
        const {email, code} = data;
        const updatedUser = await authService.verifyAccount(email, code);
        res.json({
            message: 'User Verified Successfully',
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}


export async function login(req, res, next) {
    try {
        const data = validateBody(loginDTO, req.body);
        const { email, password } = data;
        const result = await authService.login(email, password);
        if (result && result.twoStepRequired) {
            return res.json({
                message: 'Verification code sent to your email',
                success: true,
                twoStepRequired: true,
            });
        }
        res.cookie('access_token', result.accessToken, {
            httpOnly: true,
            maxAge: toMs(1, 'hours'),
        });
        res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            maxAge: toMs(7, 'days'),
            path: '/api/auth/refresh-token',
        });
        res.json({
            message: 'User Login Successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export async function sendOtp(req, res, next) {
    try {
        const data =validateBody(sendOTPDto, req.body);
        const {email} =  data;
        await authService.sendOtp(email);
        res.json({message: "new otp sent,check user email", success: true});
    } catch (err) {
        next(err);
    }
}


export async function resetPassword(req, res, next) {
    try {
        const data = validateBody(resetPasswordDTO, req.body);
        const { email, code, newPassword } = data;
        await authService.resetPassword(email, code, newPassword);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

export async function loginWithGoogle(req, res, next) {
    try {
        const token = await authService.loginWithCGoogle(req.body.idToken);
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: toMs(1, 'hours'),
        });
        res.json({ message: "user login successfully", success: true });
    } catch (error) {
        next(error);
    }
}

export async function refreshToken(req, res, next) {
  try {
    const { accessToken, refreshToken } = await authService.refreshTokenFn(req.cookies.refresh_token);
    setCookies(res, accessToken, refreshToken)
    res.json({
      message: "refresh token successfully",
      success: true,
      data: { accessToken, refreshToken }
    });

  } catch (error) {
    next(error);
  }
}

export async function enable2StepVerification(req, res, next) {
  try {
    await authService.enable2StepVerification(req.body.email);
    res.json('OK');
  } catch (error) {
    next(error);
  }
}


export async function verifyCodeActiveTwoStepVerification(req, res, next) {
  try {
    await authService.verifyCodeActiveTwoStepVerification(req.body.email, req.body.code);
    res.json('OK');
  } catch (error) {
    next(error);
  }
}

export async function verifyCodeTwoStepVerification(req, res, next) {
  try {
    const { accessToken, refreshToken } = await authService.verifyCodeTwoStepVerification(req.body.email, req.body.code);
    setCookies(res, accessToken, refreshToken);
    res.json('ok');
  } catch (error) {
    next(error);
  }
}