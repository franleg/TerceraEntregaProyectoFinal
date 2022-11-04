import mongoose from "mongoose";
import MongoDbContainer from './mongoContainer.js';

const collection = 'Users';

const usersSchema = new mongoose.Schema({
    name: String,
    age: Number,
    adress: String,
    tel: Number,
    avatar: String,
    email: String,
    cart: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Carts',
    }],
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

export default class Users extends MongoDbContainer{
    constructor() {
        super(collection, usersSchema);
    }

    findByEmail = async (email) => {
        const result = await this.model.findOne({email});
        return result;
    }
}