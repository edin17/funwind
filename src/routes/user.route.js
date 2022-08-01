const { httpRegisterUser, httpLoginUser, httpLogOutUser } = require("../controllers/user.controller")
const { verifyToken } = require("../utils/token.verify")

const userRouter = require("express").Router()

userRouter.post("/register",httpRegisterUser)
userRouter.post("/login",httpLoginUser)
userRouter.post("/logout",verifyToken,httpLogOutUser)

module.exports=userRouter