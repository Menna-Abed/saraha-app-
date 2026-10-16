import {User} from "../model/user.model.js";

export async function updateUserByEmail(email, updatedData)   {
    return User.findOneAndUpdate(
        {email: email},
        updatedData,
        {returnDocument: 'after'}
    );
}

export async function findUserById(id) {
    // return User.findById(id)==findOne in performance
    return User.findOne({ _id: id, isDeleted: false }, {}, {});
}