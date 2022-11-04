import mongoose from 'mongoose';
import MongoDbContainer from './mongoContainer.js';

const collection = 'Carts';

const cartsSchema = mongoose.Schema({
    timestamp: String,
    products: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Products',
    }],
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Users',
    }
});

export default class Carts extends MongoDbContainer{
    constructor() {
        super(collection, cartsSchema);
    }
}