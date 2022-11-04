import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import config from './config/config.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
const io = new Server(server);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${config.mongo.USER}:${config.mongo.PASSWORD}@codercluster.skwuuph.mongodb.net/${config.mongo.DATABASE}?retryWrites=true&w=majority`,
        ttl: 120
    }),
    secret: config.session.SECRET,
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());

app.use(flash());

app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on('connection', socket =>{
    console.log("Cliente conectado en socket: " + socket.id);
    //logger.info("Cliente conectado en socket: " + socket.id);

    // ADD PRODUCT
    socket.on('client: add product', data => {
        let newProduct = data;
        io.emit('server: new product', newProduct);
    })

    // DELETE PRODUCT
    socket.on('client: delete product', data => {
        let allProducts = data;
        io.emit('server: products', allProducts);
    })

    // UPDATE PRODUCT
    socket.on('client: update product', data => {
        let productsUpdated = data;
        io.emit('server: productsUpdated', productsUpdated);
    })

    // GET PRODUCT
    socket.on('client: get product', data => {
        let product = data;
        io.emit('server: product', product);
    })
})