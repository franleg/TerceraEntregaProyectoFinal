import passport from 'passport';
import local from 'passport-local';
import usersModel from '../dao/Users.js';
import { createHash, isValidPassword } from '../utils.js';
import services from '../dao/config.dao.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    // REGISTER STRATEGY
    passport.use('register', new LocalStrategy({passReqToCallback: true, usernameField: 'email', session: false}, async (req, email, password, done) => {
        try{
            const { name, age, adress, tel } = req.body;
            if (!name || !age || !adress || !tel || !req.file || !email || !password) return done(null, false, {message: 'Campos incompletos'});
            const exists = await services.usersService.findByEmail(email);
            if (exists) return done(null, false, {message: 'El usuario ya existe'});
            let newUser = {
                name,
                age,
                adress,
                tel,
                avatar: req.file.filename,
                cart: [],
                email,
                password: createHash(password),
            };
            let result = await services.usersService.save(newUser);
            return done(null, result);
        } catch (error) {
            done(error);
        }
    }));

    // LOGIN STRATEGY
    passport.use('login', new LocalStrategy({usernameField: 'email', session: false}, async (email, password, done) => {
        try{
            if (!email || !password) return done(null, false, {message: 'Campos incompletos'});
            const user = await services.usersService.findByEmail(email);
            if (!user) return done(null, false, {message: 'Usuario no encontrado'});
            if (!isValidPassword(user, password)) return done(null, false, {message: 'Contraseña incorrecta'});
            return done(null, user);
        } catch (error) {
            done(error);
        }        
    }));

    // SERIALIZATION
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // DESERIALIZATION
    passport.deserializeUser(async (id, done) => {
        let result = await usersModel.findOne({_id: id});
        return done (null, result);
    })
};

export default initializePassport;