import jwt from 'jsonwebtoken';
import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from '../../user/repository/user.repository.js'
import { cacheProvider } from "../../../lib/cache/init.js";
import { env } from '../../../lib/config/env.js';
import { mailjetProvider } from "../../../lib/email/init.js";
import { AppError } from "../../../lib/error/error.js";
 
import { toSeconds } from "../../../pkg/utils/time.js";
import {toMs} from "../../../pkg/utils/time.js";
import {otpExpired ,invalidCode,invalidPassword} from "../errors.js";
import { userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified } from "../../user/errors.js";
import {generateOTPCode} from "../../../lib/utils/otp.js";
import {logger} from "../../../pkg/logger/logger.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, generateAccessToken, generateRefreshToken, hashPassword} from "../utils.js";
import {verifyGoogleToken} from "../../../lib/utils/google-auth.js";
import {mailjetProvider} from "../../../lib/email/init.js";
 

const twoStepVerificationKey = '2-step-verification:'
const sendOtpKey = 'otp:';
  

export async function register(userData) {
  // We make an error example to check serve erro handler
      /*  const x =20;
    x=15;*/
  // 1. check user existence
  const userExist = await authRepository.checkUserExistByEmail(userData.email);
  // 2. if yes, throw an error.
  if (userExist) throw userAlreadyExist;
  // 3. prepare data [hash-password]
  userData.password = await hashPassword(userData.password);
  // 4. save user into DB -> isVerified: false
  const createdUser = await authRepository.createUser(userData);// role: doctor
  // 5.generate and save otp into DB
  const code = generateOTPCode(); 
  await cacheProvider.set(`${sendOtpKey}${createdUser._id.toString()}`, code, toSeconds(3, 'minutes'));
  // 6. send email verification OTP
  await mailjetProvider.sendMail(userData.email, 'verification code', `<h1>Your verification code is ${code} </h1>`);
  return createdUser;
}

export async function verifyAccount(email, code) {
  // 1. check user existence
  const user = await authRepository.checkUserExistByEmail(email); 
  if (!user) throw userNotExist; 
  if (user['isVerified'] === true) throw userAlreadyVerified;
  // 2. check otp validation 
  const cacheCode = await cacheProvider.get(`${sendOtpKey}${user._id.toString()}`);
  // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
  if (!cacheCode) throw otpExpired; 
  if (cacheCode !== code) throw invalidCode;
  // 3. Switch your isVerified to true  
  const updatedUser = await userRepository.updateUserByEmail(email, { isVerified: true });
  // 4. delete otp from DB 
  await cacheProvider.del(`${sendOtpKey}${user._id.toString()}`);

  return updatedUser;
}

// to enable 2 step verification
export async function enable2StepVerification(email) {
  const code = generateOTPCode();
  await cacheProvider.set(`${twoStepVerificationKey}${email}`, code, toSeconds(3, 'minutes'));
  await mailjetProvider.sendMail(email, '2 step verification code', `your 2 step verification code is ${code}`);
}


export async function verifyCodeActiveTwoStepVerification(email, code) {
  // 1. check user existence
  const user = await authRepository.checkUserExistByEmail(email);  
  if (!user) throw userNotExist;
  console.log(`${twoStepVerificationKey}${email}`);

  // 2. check otp validation 
  const cacheCode = await cacheProvider.get(`${twoStepVerificationKey}${email}`);
  console.log(cacheCode); 
  if (!cacheCode) throw otpExpired; 
  if (cacheCode !== code) throw invalidCode;

  // 3. generate access Token
  await userRepository.updateUserByEmail(email, { twoStepVerification: true });
  // 4. delete otp from DB 
  await cacheProvider.del(`${twoStepVerificationKey}${email}`);

}


export async function login(email, password) {
  // check into cache
  const loginKey = `${email}:login`;
  const cachedAttempt = await cacheProvider.get(loginKey);
  if (cachedAttempt === 'banned') throw new AppError('Your account is temporarily banned. Try again after 5 minutes', 429);
  // 1. check user existence
  const user = await authRepository.checkUserExistByEmail(email); 

  // 1.1 not exist
  if (!user) throw userNotExist;
  // 1.2 not verified
  if (user['isVerified'] === false) throw userNotVerified;
  // 2. compare password
  const match = await comparePassword(password, user['password']);
  if (!match) {
    // track failed attempts
    const currentAttempts = cachedAttempt ? parseInt(cachedAttempt) : 0;
    const newAttempts = currentAttempts + 1;
    if (newAttempts >= 5) {
      // ban for 5 minutes
      await cacheProvider.set(loginKey, 'banned', toSeconds(5, 'minutes'));
      throw new AppError('Your account is temporarily banned due to 5 failed login attempts. Try again after 5 minutes', 429);
    }
    await cacheProvider.set(loginKey, newAttempts.toString(), toSeconds(5, 'minutes'));
    throw invalidPassword;
  }

  // reset failed attempts on successful login
  await cacheProvider.del(loginKey);

  if (user.twoStepVerification == true) {
    const code = generateOTPCode();
    await cacheProvider.set(`${twoStepVerificationKey}${email}`, code, toSeconds(1, 'minutes'));
    await mailjetProvider.sendMail(email, '2 step verification code', `<h3>your code is ${code}</h3>`)
    return { twoStepRequired: true }
  } 
  // 3. generate access Token
  const accessToken = generateAccessToken({ id: user._id, name: user.name });
  const refreshToken = generateRefreshToken({ id: user._id, name: user.name });

  return {
    accessToken, refreshToken
  }
}

export async function verifyCodeTwoStepVerification(email, code) {
  // 1. check user existence
  const user = await authRepository.checkUserExistByEmail(email); 
  // 1.1 if you don't exist >> error "User not exist."
  if (!user) throw userNotExist;
  // 2. check otp validation 

  const cacheCode = await cacheProvider.get(`${twoStepVerificationKey}${email}`);

  // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
  if (!cacheCode) throw otpExpired;
  // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid otp'
  if (cacheCode !== code) throw invalidCode;

  // 3. generate access Token
  const accessToken = generateAccessToken({ id: user._id, name: user.name });
  const refreshToken = generateRefreshToken({ id: user._id, name: user.name });
  // 4. delete otp from DB 
  await cacheProvider.del(`${twoStepVerificationKey}${email}`);

  return { accessToken, refreshToken };
}

export async function sendOtp(email) {
  // 1. check user existence
  const user = await authRepository.checkUserExistByEmail(email);// {} | null
  if (!user) throw userNotExist;
  // 2. delete all old OTPs 
  // 3. generate OTP and save it into DB
  const code = generateOTPCode();
  await cacheProvider.set(`${sendOtpKey}${user._id.toString()}`, code, toSeconds(3, 'minutes'));
  // 4. send otp email
  await mailjetProvider.sendMail(email, 'new otp', `<p>your new otp is ${code}</p>`);
}

export async function resetPassword(email, code, newPassword) {
  // get user data.
  const user = await authRepository.checkUserExistByEmail(email);
  // 1. verify otp code
  const otp = await cacheProvider.get(`${sendOtpKey}${user._id.toString()}`);
  if (!otp) throw otpExpired;
  if (otp.code !== code) throw invalidCode;
  // 2. hashPassword
  const hashedPassword = await hashPassword(newPassword);
  // 3. update user password
  await userRepository.updateUserByEmail(email, { password: hashedPassword });
  // 4. delete otp
  
  await cacheProvider.del(`${sendOtpKey}${user._id.toString()}`)
}

export async function loginWithCGoogle(idToken) {
  
  const payload = await verifyGoogleToken(idToken);
   
  const user = await authRepository.checkUserExistByEmail(payload.email);
   
  if (user) {
    return generateAccessToken({
      id: user._id,
      email: user.email,
    });
  }
   
  const createdUser = await authRepository.createUser({
    // _id: payload.id,
    name: payload.name,
    email: payload.email,
    provider: 'google',
    isVerified: true,
  }); 
  return generateAccessToken({
    id: createdUser._id,
    email: createdUser.email,
  });
}
 
export async function refreshTokenFn(token) {
  const payload = jwt.verify(token, env.jwt.refreshSecret); 
  const accessToken = generateAccessToken({ id: payload.id, name: payload.name });
  const refreshToken = generateRefreshToken({ id: payload.id, name: payload.name });
  return {
    accessToken, refreshToken
  }
}