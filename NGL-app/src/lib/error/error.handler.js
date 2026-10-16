import {logger} from "../../pkg/logger/logger.js";

export function globalErrorHandler(err, req, res, _next) {
  
// global error handler

        logger.error(err.message,{
            stack:err.stack,
            correlationId:err.correlationId
        });
        if (err.isOperational === true) {
            return res.status(err.statusCode).json({
                message: err.message,
                success: false,

            });
        }
        return res.status(500).json({
            message: 'Something went wrong',
            success: false,
        });


}