const db = require("../utils/connect")
const { validateCreatePost, validateModifyPost } = require("../validation/post.validation")
const cloudinary = require("cloudinary").v2
const { postTimePast, cleanLocalPhotos } = require("../utils/date.functions")
require("dotenv").config()

cloudinary.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    cloud_name:process.env.CLOUD_NAME
})



function httpCreatePost(req,res){
    const post = {
        user_id:req.user.user_id,
        topic:req.body.topic,
        description:req.body.description
    }
    const {error,result} = validateCreatePost(post)
    if(!error){
        post.post_date = new Date().toLocaleDateString() +" "+ new Date().toLocaleTimeString("en-GB")
        if(req.file.originalname){
            cloudinary.uploader.upload(req.file.path,(err,result)=>{
                if(!err){
                    post.photo_url = result.url 
                    const values = [post.photo_url, post.user_id, post.post_date,post.topic,post.description]
                    db.query("INSERT INTO posts(photo,user_id,post_date,topic,description) VALUES($1,$2,$3,$4,$5)",values,(err,result)=>{
                        if(!err){
                            res.redirect("/")
                            cleanLocalPhotos()
                        }else{
                            res.status(400).json(err)
                        }
                    })
                }else{
                    res.json(err)
                }
            })
        }else{
            res.json("Problem")
        }


    }else{
        res.status(400).json(error.details[0].message)
    }

}

function httpDeletePost(req,res){
    const postID = Number(req.params.id)
    
    db.query(`DELETE FROM posts WHERE post_id=${postID} AND user_id=${req.user.user_id}`,(err,result)=>{
        if(!err){
            if(result.rowCount>0){
                res.json(true)
            }else{
                res.status(404).json("Post doesnt exist.")
            }
        }else{
            res.status(400).json(err.message)
        }
    })
}

function httpGetSinglePost(req,res){
    const id = Number(req.params.id)

    db.query(`SELECT photo,post_date,topic,posts.description,users.username,users.profile_photo FROM posts 
    INNER JOIN users ON posts.user_id=users.user_id
    WHERE posts.post_id=${id};`,(err,result)=>{
        if(!err){
            if(result.rows.length!==0){
                const data = result.rows[0]
            
                data.timePast=postTimePast(data.post_date,data.post_date)
                res.json(data)
            }else{
                res.status(404).json("Post does not exists.")
            }

        }else{
            res.status(404).json(err.message)
        }
    })
}

function httpModifyPost(req,res){
    const id = Number(req.params.id)
    const update = {
        description:req.body.description,
        topic:req.body.topic
    }
    const {error,result} = validateModifyPost(update)
    if(!error){
        db.query(`UPDATE posts SET description='${update.description}', topic='${update.topic}'
        WHERE post_id=${id} AND user_id=${req.user.user_id}`,(err,result)=>{
            if(!err){
                res.json(result.rows[0])
            }else{
                res.json(err.message)
            }
        })
    }else{
        res.status(400).json(error.message)
    }

}
function httpGetProfilePosts(req,res){
    const userid = Number(req.params.userid)
    db.query(`SELECT photo,post_id FROM posts
    WHERE user_id=${userid}`,(err,result)=>{
        if(!err){
            return res.json(result.rows)
        }else{
            return res.status(400).json(err.message)
        }
    })
}

module.exports = {
    httpCreatePost:httpCreatePost,
    httpDeletePost:httpDeletePost,
    httpGetSinglePost:httpGetSinglePost,
    httpModifyPost:httpModifyPost,
    httpGetProfilePosts:httpGetProfilePosts
}