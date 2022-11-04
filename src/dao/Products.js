import mongoose from "mongoose";
import MongoDbContainer from "./mongoContainer.js";

const collection = 'Products';

const productsSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    thumbnail: String,
    stock: Number,
    timestamp: String,
    code: String,
});

export default class Products extends MongoDbContainer{
    constructor() {
        super(collection, productsSchema);
    }
    validateId = (id) => {
        if(typeof id === 'number'){
            id = String(id)
            return id;
        };
        return id;
    }
}