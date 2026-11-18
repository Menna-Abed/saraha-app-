 
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { env } from "../../lib/config/env.js";
import { toMs } from "../../pkg/utils/time.js";


export async function hashPassword(password) {
  return argon2.hash(password);
}

export async function comparePassword(password, hashedPassword) {
  return argon2.verify(hashedPassword, password);
}

export function generateAccessToken(payload) {
  return jwt.sign(
    payload, env.jwt.accessSecret,
    { expiresIn: toMs(1, 'hours') }
  );
}

export function generateRefreshToken(payload) {
  return jwt.sign(
    payload, env.jwt.refreshSecret,
    { expiresIn: toMs(7, 'days') }
  );
}


export function setCookies(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    maxAge: toMs(1, 'hours')
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: toMs(7, 'days'),
    path: '/api/auth/refresh-token'
  });
}