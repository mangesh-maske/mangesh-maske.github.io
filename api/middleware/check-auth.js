const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try{
        const token = req.headers.autherization;
        const decode = jwt.verify(token, process.env.JWT_KEY);
        next();
    }
    catch(error){
        return res.status(401).json({
            code:401,
            message:'Auth failed'
        });
    }
};