const express = require("express")
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/user.route")
const { deleteBlackList } = require("./utils/blacklist.delete")
const postRouter = require("./routes/post.route")
const reactionRouter = require("./routes/reactions.route")

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/user",userRouter)
app.use("/post",postRouter)
app.use("/reaction",reactionRouter)

module.exports=app