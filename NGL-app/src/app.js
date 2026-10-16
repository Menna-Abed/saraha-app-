import './lib/db/mongoose.js';
import express from 'express';
import cors from "cors";
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "../src/route.js";
import {correlationId} from "./pkg/correlation/correlationId.js";
import cookieParser from "cookie-parser";


export function createApp() {

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({origin:'http://localhost:4200'}));
// get static files
    app.use('/uploads', express.static('uploads'));

    app.use(correlationId);

//Route
    app.use('/api', router)

// global error handler
    app.use(globalErrorHandler);
    return app;
}