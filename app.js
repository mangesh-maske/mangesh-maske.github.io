const express = require('express');
const app = express();
const morgan = require('morgan');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes to handle requests
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders'); 
const userRoutes = require('./api/routes/user');

// Middleware used
// mongoose.connect('mongodb+srv://myshop:'+process.env.MONGO_ATLAS_PW+'@my-shop-c7djn.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
mongoose.connect('mongodb+srv://myshop:'+process.env.MONGO_ATLAS_PW+'@my-shop-c7djn.mongodb.net/test?retryWrites=true', { useMongoClient: true, useNewUrlParser: true })

app.use(morgan('dev')); //for logging output in terminal window
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false})); //for parcing url encoded data
app.use(bodyParser.json()); //for parcing json encoded data

app.use(express.static('public'));

// Allowing other servers requests
app.use((req, res, next) => {
    res.header("Allow-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // Specifing which methods our api supports 
    if( req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Actual Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Error handling 404
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error); 
});

// Handling other types of error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;