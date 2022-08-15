const { httpRegisterUser, httpLoginUser, httpLogOutUser, httpUploadProfilePhoto, httpFollow, httpUnfollow, httpSearch, httpGetProfile } = require("../controllers/user.controller")
const { verifyToken } = require("../utils/token.verify")
const upload = require("../utils/multer.config")

const userRouter = require("express").Router()

userRouter.post("/register",httpRegisterUser)
userRouter.post("/login",httpLoginUser)
userRouter.post("/logout",verifyToken,httpLogOutUser)
userRouter.put("/uploadprofile",verifyToken,upload.single("picture"),httpUploadProfilePhoto)
userRouter.post("/follow",verifyToken,httpFollow)
userRouter.post("/unfollow",verifyToken,httpUnfollow)
userRouter.get("/search/:username",verifyToken,httpSearch)
userRouter.get("/getprofile/:id",verifyToken,httpGetProfile)

module.exports=userRouter