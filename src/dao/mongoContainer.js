import mongoose from "mongoose";
import config from "../config/config.js";

export default class MongoDbContainer {
    constructor(collection, squema) {
        mongoose.connect (`mongodb+srv://${config.mongo.USER}:${config.mongo.PASSWORD}@codercluster.skwuuph.mongodb.net/${config.mongo.DATABASE}?retryWrites=true&w=majority`, err=>{
            if(err) console.log(err);
            else console.log('Connected to Atlas');
        });
        this.model = mongoose.model(collection, squema);
    }

    getAll = async() => {
        const results = await this.model.find().lean();
        return results;
    }

    getById = async(id, collection) => {
        if (collection) {
            let document = await this.model.findById({_id: id}).populate(collection).lean();
            return document;
        }
        if(mongoose.Types.ObjectId.isValid(id)){
            let document = await this.model.findById({_id: id});
            return document;
        }
    }


    save = async(document) => {
        let newDoc = await this.model.create(document);
        return newDoc;
    }

    update = async(oldDoc, newDoc) => {
        if(newDoc){
            await this.model.findOneAndUpdate({_id:oldDoc._id}, newDoc);
            return newDoc;
        }
        await this.model.findOneAndUpdate({_id:oldDoc._id}, oldDoc);
        return oldDoc;
    }

    deleteById = async(id) =>{
        let document = await this.model.findById(id);
        await this.model.deleteOne({_id: id});
        return document;
    }
}