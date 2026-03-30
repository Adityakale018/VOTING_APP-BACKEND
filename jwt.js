const jwt = require('jsonwebtoken');

const jwtMiddleware = (req,res,next) => {
    // extract jwt token from request headers

    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error:'Authorization header must start with Bearer'});
    }

    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json({error:'No token provided'});

    try{
        // verify jwt token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //attach user info to request object

        req.user=decoded;
        next();
    }catch(err){
        console.error(err);
        return res.status(401).json({error:'invalid token'});
    }
}

// generation of jwt token

const generateToken = (userData) => {
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:3000000});
}

module.exports = {jwtMiddleware,generateToken}