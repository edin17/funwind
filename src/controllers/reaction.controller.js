const db = require("../utils/connect")
const { addReaction } = require("../validation/reaction.validation")

function httpAddReaction(req,res){
    const reactionData = {
        reactionCode:req.body.reactionCode,
        userId:req.user.user_id,
        postId:req.body.postId,
    }
    const reactionId = reactionData.userId.toString()+"r"+reactionData.postId.toString()

    const {error,result} = addReaction(reactionData)
    if(!error){
        reactionData.reactionDate=new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString("en-GB")
        console.log(reactionData.reactionDate)
        const values = [reactionData.reactionCode,reactionData.userId,reactionData.reactionDate,reactionData.postId,reactionId]
        db.query("INSERT INTO reactions VALUES($1,$2,$3,$4,$5) ON CONFLICT(reaction_id) DO NOTHING",values,(err,result)=>{
            if(!err){
                res.json(true)
            }else{
                res.status(400).json(err)
            }
        })
    }else{
        res.status(400).json(error.details[0].message)
    }
}

function httpGetReactions(req,res){
    const id = Number(req.params.id)

    db.query(`SELECT reaction_code,reaction_date,users.username FROM reactions
    INNER JOIN users ON reactions.user_id=users.user_id
    WHERE reactions.post_id=${id};`,(err,result)=>{
        if(!err){
            res.json(result.rows)
        }else{
            res.status(404).json(err.message)
        }
    })
}

function httpUpdateReaction(req,res,reactionData){
    db.query(`UPDATE reactions SET reaction_code=${reactionData.reactionCode},reaction_date='${reactionData.reactionDate}'
    WHERE user_id=${reactionData.userId};`,(err,result)=>{
        if(!err){
            res.json(true)
        }else{
            res.status(400).json(err.message)
        }
    })
}
function httpDeleteReaction(req,res){
    const postId = Number(req.params.id)
    const userId = Number(req.body.userId)

    db.query(`DELETE FROM reactions WHERE user_id=${userId} AND post_id=${postId}`,(err,result)=>{
        if(!err){
            res.json(true)
        }else{
            res.status(400).json(err.message)
        }
    })
}

function getReactionsStats(req,res){
    const userid=Number(req.params.userid)

    db.query(`SELECT posts.post_id,AVG(reaction_code),COUNT(reaction_code) FROM reactions
    INNER JOIN posts ON reactions.post_id=posts.post_id
    WHERE posts.user_id=${userid} GROUP BY reactions.post_id,posts.post_id`,(err,result)=>{
        if(!err){
            return res.json(result.rows)
        }else{
            return res.status(500).json("Something is wrong with server.")
        }
    })
}

module.exports = {
    httpAddReaction:httpAddReaction,
    httpGetReactions:httpGetReactions,
    httpDeleteReaction:httpDeleteReaction,
    getReactionsStats:getReactionsStats
}