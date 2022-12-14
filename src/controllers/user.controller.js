const db = require("../utils/connect")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cloudinary = require("cloudinary").v2

require("dotenv").config

const { validateRegister, validateLogin } = require("../validation/user.validation")
const { cleanLocalPhotos } = require("../utils/date.functions")


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
    const user = req.body
    console.log(user)
    const {error,result} = validateLogin(user)
    if (!error) {
        db.query(`SELECT user_id,password FROM users WHERE username='${user.username}'`,async (err,result)=>{
            if(err){
                return res.status(400).json(err.message)
            }else{
                const userData = result.rows[0]
                if(userData){
                    const comparedPassword = await bcrypt.compare(user.password,userData.password)
                    if(comparedPassword){
                        const expiresTime=900000
                        const token = jwt.sign({user_id:userData.user_id},process.env.JWT_SECRET,{
                            algorithm:"HS256",
                            expiresIn:expiresTime
                        })
                        if(token){
                            res.cookie("token",token,{maxAge:expiresTime*1000})
                            res.json(userData)
                        }
                    }else{
                        res.status(400).json("Password is not correct.")
                    }
                }else{
                    return res.status(404).json("User does not exist.")
                }

            }
            
        })
    } else {
        res.status(400).json(error.details[0].message)
    }

    
}

function httpLogOutUser(req,res){
    const token = req.cookies.token
    const exp_date =  new Date().toLocaleString("en-GB") 
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

function httpUploadProfilePhoto(req,res){
    cloudinary.uploader.upload(req.file.path,(err,result)=>{
        const photo_url = result.url
        if(!err){
            db.query(`UPDATE users SET profile_photo='${photo_url}' WHERE user_id=${req.user.user_id};`,(err,result)=>{
                if(!err){
                    cleanLocalPhotos()
                    return res.json(true)
                }else{
                    return res.status(400).json(err.message)
                }
            }) 
        }else{
            return res.status(400).json(err)
        }
    })
    
}

function httpFollow(req,res){
    const followData = {
        userId:req.user.user_id,
        followingId:req.body.followingId
    }
    const values = [followData.userId,followData.followingId]
    db.query(`INSERT INTO follows (user_id,following_id) SELECT ${values[0]},${values[1]}
    WHERE NOT EXISTS (SELECT * FROM follows WHERE user_id=${values[0]} AND following_id=${values[1]});`,(err,result)=>{
        if(!err){
            res.json(true)
        }else{
            res.status(400).json(err.message)
        }
    })
}

function httpUnfollow(req,res){
    const unfollowData = {
        userId:req.user.user_id,
        followingId:req.body.followingId
    }
    db.query(`DELETE FROM follows WHERE user_id=${unfollowData.userId} AND following_id=${unfollowData.followingId}`,(err,result)=>{
        if(!err){
            res.json(true)
        }else{
            res.status(400).json(err.message)
        }
    })
}

function httpSearch(req,res){
    const searched = req.params.username
    if(searched.length===0){
        return
    }else{
        db.query(`SELECT username,profile_photo FROM users WHERE username='${searched}'`,(err,result)=>{
            if(!err){
                if(result.rows.length===0){
                    return res.status(404).json("Not found.")
                }else{
                    return res.json(result.rows)
                }
            }else{
                return res.status(400).json(err)
            }
        })
    }
}


function httpGetProfile(req,res){
    const userid = Number(req.params.id)

    db.query(`SELECT username,email,age,profile_date,users.description,profile_photo,COUNT(posts.user_id) AS posts FROM users 
    INNER JOIN posts ON users.user_id=posts.user_id
    WHERE users.user_id = ${userid} GROUP BY username,age,email,profile_date,users.description,profile_photo;`,(err,result)=>{
        if(!err){
            if(result.rows.length!==0){
                return res.json(result.rows) 
            }else{
                return res.status(404).json("User does not exists.")
            }

        }else{
            return res.status(500).json(err.message)
        }
    })
}



module.exports = {
    httpRegisterUser:httpRegisterUser,
    httpLoginUser:httpLoginUser,
    httpLogOutUser:httpLogOutUser,
    httpUploadProfilePhoto:httpUploadProfilePhoto,
    httpFollow:httpFollow,
    httpUnfollow:httpUnfollow,
    httpSearch:httpSearch,
    httpGetProfile:httpGetProfile,
}