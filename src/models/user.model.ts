import { models, model, Schema } from "mongoose";

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    person: {
        first_name: {type: String || ''},
        last_name: {type: String || ''},
        gender: {type: String || ''},
        address: {type: String || ''},
        cell_number: {type: String || ''},
        profile_picture: {type: String || ''},
    },

},{timestamps:true});

const User = models.User || model('User', userSchema);

export default User;


