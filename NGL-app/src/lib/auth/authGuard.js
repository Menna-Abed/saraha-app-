import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import {AppError} from "../error/error.js";

export function authGuard(req, res, next) {
    try {
        // logic of check token
        const token = req.cookies.access_token;
        if (!token) throw new AppError('no token provided', 403);
        req.user = jwt.verify(token, env.jwt.secret); 
        next();
    } catch (error) {
        next(error);
    }
}