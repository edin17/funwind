const { httpAddReaction, httpGetReactions, httpDeleteReaction, getReactionsStats } = require("../controllers/reaction.controller")
const { verifyToken } = require("../utils/token.verify")

const reactionRouter = require("express").Router()

reactionRouter.post("/add",verifyToken,httpAddReaction)
reactionRouter.get("/collect/:id",verifyToken,httpGetReactions)
reactionRouter.post("/delete/:id",verifyToken,httpDeleteReaction)
reactionRouter.get("/reactionstats/:userid",verifyToken,getReactionsStats)

module.exports = reactionRouter