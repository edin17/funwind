const fs = require("fs")
const path = require("path")

function postTimePast(time,date){
    const postDateMS=time.getTime()
    const timeAgo = (Date.now() - postDateMS) / 1000
    const daysAgo = Math.round(timeAgo/86400)
    
    if(timeAgo<=86400){
        return "Today"
    }else if(daysAgo>7){
        return date
    }else{
        return daysAgo + "days ago"
    }
}

function cleanLocalPhotos(){
    fs.readdir(path.join(__dirname,"..","..","public"),(err,files)=>{
        for(let file of files){
            fs.unlinkSync(path.join(__dirname,"..","..","public",file))
        }
    })
}


module.exports = {
    postTimePast:postTimePast,
    cleanLocalPhotos:cleanLocalPhotos
}