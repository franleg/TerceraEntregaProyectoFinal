import { Router } from 'express';
import services from '../dao/config.dao.js';
import nodemailer from 'nodemailer';
import { __dirname } from '../utils.js';
const router = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:'legnazzifranco03@gmail.com',
        pass: 'yyzpnfzxqqfncecc'
    }
})

const messageHTML = (cart) => {
    let products = "";
    cart.products.forEach(product => {
        products += `<div>
                        <p>Producto: ${product.name}</p>
                        <p>Precio: $${product.price}</p>
                        <p>Descripción: ${product.description}</p>
                    </div>`
    }) 
    return products;
}

//---- ADD PRODUCT IN CART BY ID ----//
router.post('/', async(req, res) => {
    const user = req.session.user;
    const cartId = user.cart[0];
    let cart = await services.cartsService.getById(cartId);
    let productId = req.body.id;
    let product = await services.productsService.getById(productId);
    cart.products = cart.products.concat(product);
    await services.cartsService.update(cart);
    await services.usersService.update(user);
    res.status(200).send({status: 'success', payload: user}); 
});

//---- DELETE PRODUCT IN CART BY ID ----//
router.delete('/', async(req, res)=> {
    const user = req.session.user;
    const cartId = user.cart[0];
    let cart = await services.cartsService.getById(cartId);
    let productId = req.body.id;
    let productToRemove = cart.products.find(prod => prod.id === productId);
    let productIndex = cart.products.indexOf(productToRemove);
    cart.products.splice(productIndex, 1); 
    await services.cartsService.update(cart); 
    await services.usersService.update(user);
    cart = await services.cartsService.getById(cartId, 'products');
    res.status(200).send(cart.products);
});

// SEND MAIL
router.get('/confirm', async(req, res) => {
    const user = req.session.user;
    const cartId = user.cart[0];
    let cart = await services.cartsService.getById(cartId, 'products');
    await services.cartsService.update(cart);
    let result = await transporter.sendMail({
        from: 'Yo',
        to: user.email,
        subject: 'Confirmación de compra',
        html: `<div>
                <h1>¡Hola ${user.name}, gracias por tu compra!</h1>
                <h2>Detalle de la orden:</h2>
                ${messageHTML(cart)}
            </div>`
    })
    cart.products = [];
    await services.cartsService.update(cart);
    console.log(result);
    res.send(cart.products);
})

export default router;