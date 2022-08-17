const db = require("../utils/connect")

function httpGetFollowsInfo(req,res){
    const userid = Number(req.params.userid)

    db.query(`SELECT COUNT(user_id) AS followings FROM follows WHERE follows.user_id=${userid}
    UNION
    SELECT COUNT(following_id) AS followers FROM follows WHERE follows.following_id=${userid};`,(err,result)=>{
        if(!err){
            if(result.rows.length!==0){
                return res.json(result.rows)
            }else{
                return res.status(404).json("User does not exists.")
            }  
        }else{
            return res.status(500).json("Something is worng with server!")
        }
    })
}

module.exports = {
    httpGetFollowsInfo:httpGetFollowsInfo
}