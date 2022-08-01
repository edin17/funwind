const db = require("../utils/connect")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config

const { validateRegister } = require("../validation/user.validation")


async function httpRegisterUser(req,res){
    const user = {
        username:req.body.username,
        email:req.body.email,
        age:req.body.age,
        profileDate:new Date().toISOString().split("T")[0],
        password:req.body.password,
        repeated_password:req.body.repeated_password
    }
    const {error,result}=validateRegister(req.body)
    if(!error){
        const hashedPassword = await bcrypt.hash(user.password,10)
        if(hashedPassword){
            const values = [user.username,user.email,user.age,user.profileDate,hashedPassword]
            db.query("INSERT INTO users(username,email,age,profile_date,password) VALUES($1,$2,$3,$4,$5)",values,(err,qResult)=>{
                if(err){
                    res.json(err.detail)
                }else{
                    res.json(user)
                }
            })
        }else{
            res.send("Invalid hashing!")
        }

    }else{
        res.status(400).json(error.details[0].message)
    }

}

function httpLoginUser(req,res){
    const user = {
        username:req.body.username,
        password:req.body.password
    }
    
    db.query(`SELECT username,password FROM users WHERE username='${user.username}'`,async (err,result)=>{
        if(err){
            return res.status(400).json(err.message)
        }else{
            const userData = result.rows[0]
            const comparedPassword = await bcrypt.compare(user.password,userData.password)
            console.log(comparedPassword)
            if(comparedPassword){
                const expiresTime=900
                const token = jwt.sign({username:userData.username},process.env.JWT_SECRET,{
                    algorithm:"HS256",
                    expiresIn:expiresTime
                })
                if(token){
                    res.cookie("token",token,{maxAge:expiresTime*1000})
                    res.end()
                }
            }else{
                res.status(400).json("Password is not correct.")
            }
        }
        
    })
    
}

function httpLogOutUser(req,res){
    const token = req.cookies.token
    const exp_date =  new Date().toLocaleString() 
    console.log(exp_date)
    const values = [token, exp_date]
    db.query(`INSERT INTO blacklist(token,exp_date) VALUES($1,$2)`,values,(err,result)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.json(result.rows[0])
        }
    })
}

module.exports = {
    httpRegisterUser:httpRegisterUser,
    httpLoginUser:httpLoginUser,
    httpLogOutUser:httpLogOutUser
}