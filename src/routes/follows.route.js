const { httpGetFollowsInfo } = require("../controllers/follows.controller")
const {verifyToken} = require("../utils/token.verify")

const followsRouter = require("express").Router()

followsRouter.get("/followscount/:userid",verifyToken,httpGetFollowsInfo)

module.exports = followsRouter
