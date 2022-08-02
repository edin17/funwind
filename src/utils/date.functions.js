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


module.exports = {
    postTimePast:postTimePast
}