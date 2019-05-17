const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/');
    },
    filename:function(req, file, cb){
        cb(null, new Date().toISOString()+file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
    if( file.mimetype === 'image/jpeg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
        },
        fileFilter:fileFilter
    }
);
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product
    .find()
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json({
            code:200,
            message: 'handing GET request of /products',
            products: doc
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })
});

router.post('/', (req, res, next) => {
    const product = new Product({   
        _id:new mongoose.Types.ObjectId(),
        name:req.body.productName,
        price:req.body.productPrice,
    });
    product
    .save()
    .then(result=> {
        console.log(result);
        res.json({
            code:200,
            message: 'Product Created Successfully',
            createdProduct : product
        });
    })
    .catch(err=>console.log(err));
    res.status(200).json({
        code:200,
        message: 'handing POST request of /products',
        createdProduct : product
    });
});

router.get('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    res.status(200).json({
        message:'show product with: '+id
    })
});

/* router.patch('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    res.status(200).json({
        message:'update product with id: '+id
    })
}); */

router.delete('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result =>{
        res.json({
            code:200,
            message:"Product deleted successfully"
        })
    })
});

module.exports = router;