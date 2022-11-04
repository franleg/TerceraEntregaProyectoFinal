const { default: MongoUser } = await import('./Users.js');
let usersService = new MongoUser();

const { default: MongoProduct } = await import('./Products.js');
let productsService = new MongoProduct();

const { default: MongoCart } = await import('./Carts.js');
let cartsService = new MongoCart();

const services = {
    usersService,
    productsService,
    cartsService
}

export default services;