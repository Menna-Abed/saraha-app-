import jwt from 'jsonwebtoken';
import {toMs} from "../../../pkg/utils/time.js";
import {env} from "../../../lib/config/env.js";

export function generateToken(payload) {
    return jwt.sign(payload, env.jwt.secret,
        { expiresIn: toMs(1, 'hours') });
}


 