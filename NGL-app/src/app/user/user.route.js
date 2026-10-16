import { Router} from 'express';
import {uploadFilesArray, uploadSingleFile} from "../../pkg/media/multer.js";
import {allowedFields, fileValidation} from "../../pkg/media/file.validation.js";
import {authGuard} from "../../lib/auth/authGuard.js";
import * as userController from "./controller/user.controller.js";
const userRouter= Router();




userRouter.post('/upload-profile-pic',authGuard, uploadSingleFile('pp'),fileValidation() ,userController.uploadProfilePic);

userRouter.post('/upload-cv', uploadSingleFile('cv',  allowedFields.files),
    fileValidation(allowedFields.files),
    (req, res, next) => {
    res.json('ok');
});

userRouter.post('/upload-cover-images', uploadFilesArray('cover-images', 3 ),
    fileValidation(),
    (req, res, next) => {
    console.log(req.files);
    res.json('ok');
});

export default userRouter;