const { httpDeletePost } = require("../controllers/post.controller")
const { httpAddReaction, httpGetReactions, httpDeleteReaction } = require("../controllers/reaction.controller")
const { verifyToken } = require("../utils/token.verify")

const reactionRouter = require("express").Router()

reactionRouter.post("/add",verifyToken,httpAddReaction)
reactionRouter.get("/collect/:id",verifyToken,httpGetReactions)
reactionRouter.post("/delete/:id",verifyToken,httpDeleteReaction)

module.exports = reactionRouter