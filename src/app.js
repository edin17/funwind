const express = require("express")
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/user.route")
const { deleteBlackList } = require("./utils/blacklist.delete")

const app = express()

app.use(cookieParser())
app.use(express.json())

deleteBlackList()

app.use("/user",userRouter)

module.exports=app