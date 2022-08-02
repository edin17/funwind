const { httpCreatePost, httpDeletePost, httpGetSinglePost, httpModifyPost } = require("../controllers/post.controller")
const upload = require("../utils/multer.config")
const { verifyToken } = require("../utils/token.verify")

const postRouter = require("express").Router()

postRouter.post("/create",verifyToken,upload.single("photo"),httpCreatePost)
postRouter.delete("/delete/:id",verifyToken,httpDeletePost)
postRouter.get("/getsingle/:id",verifyToken,httpGetSinglePost)
postRouter.put("/modify/:id",verifyToken,httpModifyPost)

module.exports = postRouter