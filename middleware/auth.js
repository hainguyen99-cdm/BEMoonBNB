const jwt = require('jsonwebtoken')
const {Users} = require('../models/Users');
const verifyToken = async (req, res, next)=>{


    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader
    if(!token) return res.sendStatus(401)

    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        
        const userToken = await Users.findOne({ _id: decoded.id });

        if (!userToken || userToken.accessToken !== token) {
            return res.status(403).json({ message: 'Token is no longer valid' });
        }
        next()
    } catch (error) {
        console.log(error)
        return res.sendStatus(403)
    }
}
module.exports = verifyToken;