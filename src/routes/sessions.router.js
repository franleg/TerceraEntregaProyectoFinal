import { Router } from 'express';
import passport from 'passport';
import { uploader } from '../utils.js';
import moment from 'moment';
import services from '../dao/config.dao.js';
import config from '../config/config.js';

const router = Router();

//---- MIDDLEWARE OF AUTENTICATION ----//
const authRole = (req, res, next) => {
    let { email, password } = req.body;
    if(email !== config.admin.EMAIL && password !== config.admin.PASSWORD) next()
    else {
        req.session.user = {
            email,
            name: config.admin.NAME,
            role: 'admin',
        }
        return res.send({status: 'success', payload: req.session.user})
    }
};

// REGISTER USER
router.post('/register', uploader.single('avatar'), passport.authenticate('register', {failureRedirect: '/api/sessions/registerfail', failureFlash: true}), async (req, res) => {
    let user = req.user;
    let newCart = {
        timestamp: moment().format(('DD/MM/YYYY hh:mm:ss')),
        products: [],
        user: user._id
    };
    let cart = await services.cartsService.save(newCart);
    user.cart = user.cart.concat(cart);
    await services.usersService.update(user);
    res.status(200).send({status: 'success', payload: req.user});
});

// LOGIN USER
router.post ('/login', authRole, passport.authenticate('login', {failureRedirect: '/api/sessions/loginfail', failureFlash: true}), async (req,res) => {
    req.session.user = {
        id: req.user._id,
        name: req.user.name,
        age: req.user.age,
        adress: req.user.adress,
        tel: req.user.tel,
        avatar: req.user.avatar,
        cart: req.user.cart,
        email: req.user.email,
        role: req.user.role
    }
    res.status(200).send({status: 'success', payload: req.session.user});
});

// REGISTER FAIL
router.get('/registerfail', (req, res) => {
    res.status(500).send({status: 'error', error: 'Error in register'});
});

// LOGIN FAIL
router.get('/loginfail', (req, res) => {
    res.status(500).send({status: 'error', error: 'Error in login'});
});

export default router;