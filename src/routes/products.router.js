import { Router } from 'express';
import { uploader } from '../utils.js';
import moment from 'moment';
import services from '../dao/config.dao.js';
import config from '../config/config.js';

const router = Router();

//---- MIDDLEWARE OF AUTENTICATION ----//
const autentication = (req, res, next) => {
    let user = req.session.user;
    if (user.email !== config.admin.EMAIL) return res.status(401).send({ error : -1, description: `Route ${req.url} method ${req.method} unauthorized.` });
    next();
};

// GET ALL PRODUCTS
router.get('/', async(req, res)=>{
    try {
        let products = await productsService.find();
        if(products.length === 0) return res.status(200).send({message: 'There are no products.'});
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ADD NEW PRODUCT
router.post('/', autentication, uploader.single('thumbnail'), async(req, res)=>{
    try {
        let newProduct = req.body;
        if(!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock|| !req.file) return res.status(400).send({error: "All fields must be completed."});
        if(isNaN(newProduct.price)) return res.status(400).send({error:`Price must be numeric.`});
        if(isNaN(newProduct.stock)) return res.status(400).send({error:`Stock must be numeric.`});
        let products = await services.productsService.getAll();
        let productExist = products.find(prod => prod.name === newProduct.name)
        if(productExist) return res.status(400).send({error: `Product ${newProduct.name} already exist.`});
        newProduct.thumbnail = req.file.filename;
        newProduct.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
        newProduct.code = Math.random().toString(35).substring(3);
        let productAdded = await services.productsService.save(newProduct);
        res.status(200).send(productAdded);
    } catch (error) {
        res.status(500).send(error)
    }
})

//---- DELETE PRODUCT BY ID ----//
router.delete('/:idProduct', autentication, async(req, res) => {
    try {
        let idProduct = req.params.idProduct;
        idProduct = await services.productsService.validateId(idProduct);
        let productToRemove = await services.productsService.getById(idProduct);
        if(!productToRemove) return res.status(400).send({error: `Product with id ${idProduct} could not be found.`});
        await services.productsService.deleteById(idProduct);
        let products = await services.productsService.getAll();
        res.status(200).send(products);
    } catch (error) {
        console.log(error)
    }
});

//---- UPDATE PRODUCT BY ID ----//
router.put('/:idProduct', autentication, uploader.single('thumbnail'), async(req, res) => {
    try {
        let idProduct = req.params.idProduct;
        if(!idProduct) return res.status(400).send({error: 'Product id is required.'});
        let newProduct = req.body;
        let productToUpdate = await services.productsService.getById(idProduct);
        if(!productToUpdate) return res.status(400).send({error: `Product with id ${idProduct} could not be found.`});
        if(!newProduct.name || !newProduct.price || !newProduct.description || !req.file) return res.status(400).send({error: "All fields must be completed."});
        if(isNaN(newProduct.price)) return res.status(400).send({error:`Price must be numeric.`});
        if(isNaN(newProduct.stock)) return res.status(400).send({error:`Stock must be numeric.`});
        let products = await services.productsService.getAll();
        let productExist = products.find(prod => prod.name == newProduct.name);
        if(productExist) return res.status(400).send({error: `Product ${newProduct.name} already exist.`});
        newProduct.thumbnail = req.file.filename;
        newProduct.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'))
        newProduct.code = Math.random().toString(35).substring(3);
        newProduct._id = productToUpdate._id;
        if (!newProduct.stock) newProduct.stock = productToUpdate.stock;
        await services.productsService.update(productToUpdate, newProduct);
        let productsUpdated = await services.productsService.getAll();
        res.status(200).send(productsUpdated);
    } catch (error) {
        console.log(error)
    }
});

//---- GET PRODUCT BY ID ----//
router.get('/:idProduct', async(req, res) => {
    try {
        let idProduct = req.params.idProduct;
        let productFound = await services.productsService.getById(idProduct);
        if(!productFound) return res.status(400).send({error: `Product with id ${idProduct} could not be found.`});
        res.status(200).send(productFound);       
    } catch (error) {
        console.log(error)
    }
});

export default router;  
