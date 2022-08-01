const jwt = require("jsonwebtoken")
const db = require("../utils/connect")
require("dotenv").config()

function verifyToken(req,res,next){
    
    const token = req.cookies.token
    if(!token){
        return res.status(401).json("Token does not exist.")
    }
    db.query(`SELECT token FROM blacklist WHERE token='${token}'`,(err,result)=>{
        if(err){
            res.status(401).json(err.message)
        }else if(result.rows.length===0){
            const verifiedToken = jwt.verify(token,process.env.JWT_SECRET)
            if(verifiedToken){
                next()
            }else{
                return false
            }
        }else{
            res.status(401).json("Your token is on blacklist, log in again.")
        }
    })

}

module.exports = {
    verifyToken:verifyToken
}
