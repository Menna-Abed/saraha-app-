import * as userRepository from "../repository/user.repository.js";
import { userNotExist } from "../errors.js";
import fs from 'node:fs';

export const uploadProfilePic = async (userId, file) => {
    // get user old image
    const user = await userRepository.findUserById(userId);
    if (!user) throw userNotExist;
    // delete old image from server
    if (user.profilePicPath) {
        fs.unlinkSync(user.profilePicPath);
    }
    // update new image
    await userRepository.updateUserByEmail(user.email, { profilePicPath: file.path });
};