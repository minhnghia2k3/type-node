// User schema
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        // avoid these fields to be selected
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    }
})

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

// Actions
export const getUsers = () => UserModel.find({})

export const getUserByEmail = (email: string) => UserModel.findOne({ email: email })

// Confirm whether user login or not
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    "authentication.sessionToken": sessionToken
})

// Find user by _id
export const getUserById = (id: string) => UserModel.findById(id)

// Create new user
/**Record: { string: any} 

};
*/
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save()
    // .toObject() => converts the mongoose document into a plain JavaScript object
    .then((user: any) => user.toObject())

// Update user by Id
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)

// Delete user by Id
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);