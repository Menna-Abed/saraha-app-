import multer, {diskStorage} from "multer";
import crypto from 'node:crypto';
import {AppError} from "../../lib/error/error.js";
import {allowedFields} from "./file.validation.js";







function multerUpload( allowedTypes=allowedFields.images) {
    return multer({
        // fileFilter is not save cause it check the extension of the file only
        fileFilter: function (req, file, cb) {
            if (!allowedTypes.includes(file.mimetype)) {
               return  cb(new AppError('invalid file format', 400), false);
            }
            cb(null, true);
        },storage: diskStorage({
            destination: 'uploads',
            filename: function (req, file, cb) {
                cb(null, `${crypto.randomUUID()}-${file.originalname}`);
            }
        })
    });
}

export function uploadSingleFile(filedName, allowedTypes=allowedFields.images) {
    return multerUpload(allowedTypes).single(filedName);
}

export function uploadFilesArray(fieldName, maxCount) {
    return multerUpload().array(fieldName , maxCount);
}

export function uploadFields(fields) {
    return multerUpload().fields(fields);
}