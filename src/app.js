const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")
const userRouter = require("./routes/user.route")
const { deleteBlackList } = require("./utils/blacklist.delete")
const postRouter = require("./routes/post.route")
const reactionRouter = require("./routes/reactions.route")
const { verifyToken } = require("./utils/token.verify")
const followsRouter = require("./routes/follows.route")

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/login",express.static(path.join(__dirname,"..","public","client","login")))
app.use("/register",express.static(path.join(__dirname,"..","public","client","register")))
app.use("/upload",express.static(path.join(__dirname,"..","public","client","upload")))
app.use("/profile/:id",express.static(path.join(__dirname,"..","public","client","profile")))
app.use("/post/:id",express.static(path.join(__dirname,"..","public","client","post")))
app.use("/",verifyToken,express.static(path.join(__dirname,"..","public","client","home")))

app.use("/user",userRouter)
app.use("/post",postRouter)
app.use("/reaction",reactionRouter)
app.use("/follows",followsRouter)

setInterval(()=>{
    deleteBlackList()
},86300)

module.exports=app