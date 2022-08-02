const jwt = require("jsonwebtoken")
require("dotenv").config()

function refreshToken(req,res){
    const token = req.cookies.token
    if(!token){
        res.status(401).json("Token does not exist.")
    }
    const verifiedToken = jwt.verify(token,process.env.JWT_SECRET)
    if(!verifiedToken){
        res.status(400).json("Token is not volid.")
    }
    const expireTime=900
    const newToken = jwt.sign({user_id:verifiedToken.user_id},process.env.JWT_SECRET,{
        algorithm:"HS256",
        expiresIn:expireTime
    })
    if(newToken){
        res.cookie("token",newToken,{maxAge:expireTime*1000})
    }
}

module.exports = {
    refreshToken:refreshToken
}