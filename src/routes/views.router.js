import { Router } from 'express';
import services from '../dao/config.dao.js';

const router = Router();

// HOME VIEW
router.get ('/', async (req, res) => {
    let user = req.session.user;
    if (user) {
        if (user.role === 'admin') res.redirect('/admin');
        else {
            let products = await services.productsService.getAll();
            res.render('home', {
                user,
                hasProducts: products.length > 0,
                products
            });
        }
    } else {
        res.redirect('/login');
    }
});

// CART VIEW
router.get('/cart', async (req, res) => {
    let user = req.session.user;
    let cartId = user.cart[0]
    const cart = await services.cartsService.getById(cartId, 'products');
    let productsInCart = cart.products;
    res.render('cart', {
        user,
        hasProducts: productsInCart.length > 0,
        productsInCart
    });
})

// ADMIN VIEW
router.get('/admin', async (req, res) => {
   const user = req.session.user;
    if (user.role === 'admin') {
        let products = await services.productsService.getAll();
        res.render('admin', {
            user,
            hasProducts: products.length > 0,
            products
        }); 
    }
    else res.redirect('/')
});

// REGISTER VIEW
router.get('/register', (req, res) => {
    res.render('register');
});

// LOGIN VIEW
router.get('/login', (req, res) => {
    res.render('login');
});

// REGISTER FAIL
router.get('/registerfail', (req, res) => {
    let errorMessage = req.flash('error')[0];
    res.locals.errorMessage = errorMessage;
    res.render('registerfail');
});

// LOGIN FAIL
router.get('/loginfail', (req, res) => {
    let errorMessage = req.flash('error')[0];
    res.locals.errorMessage = errorMessage;
    res.render('loginfail');
});

// LOGOUT VIEW
router.get('/logout', (req, res) => {
    const user = req.session.user;
    if(!user) return res.redirect('/login');
    req.session.destroy(err => {
        if (err) {
          return res.status(400).send('Unable to log out')
        } else {
            res.render('logout', user)
        }
      }); 
});

// ERROR 404
router.get('/*', (req, res) => {
/*     logger.warn({
        date: moment().format(('DD/MM/YYYY hh:mm:ss')),
        method: req.method,
        url: req.url
    }) */
    res.render('error404');
})

export default router;