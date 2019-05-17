const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
router.post('/signup', (req, res, next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.json({
                code:409,
                message:'Mail exist'
            });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                console.log('hash',hash);
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user = new User({   
                        _id:new mongoose.Types.ObjectId(),
                        name:req.body.name,
                        email:req.body.email,
                        password:hash
                    }); 
                    user
                    .save()
                    .then(result=> {
                        console.log(result);
                        res.status(200).json({
                            code:200,
                            message:'User Created'
                        });
                    })
                    .catch(
                        err=>{
                            console.log(err);
                            res.status(500).json({
                            error:err
                        });
                    });
                }
            });

        }
    })
});

router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.json({
                code:401,
                message:'Auth Failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result) =>{
            if(err){
                return res.json({
                    code:401,
                    message:'Auth Failed'
                })
            }
            if(result){
                const token = jwt.sign({
                    email:user[0].email,
                    userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn:"1h"
                    }
                );
                return res.json({
                    code:200,
                    message:'Auth Successful',
                    token:token
                })
            }
            return res.json({
                code:401,
                message:'Auth Failed'
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        }); 
    });
})

module.exports = router;