const postid = window.document.baseURI.split("/")[4]

fetch(`/post/getsingle/${postid}`)
.then(res=>{
    return res.json()
})
.then(data=>{
    console.log(data)
    const post = {
        userImg:document.getElementById("user-img"),
        username:document.getElementById("username"),
        postPhoto:document.getElementById("post-photo"),
        description:document.getElementById("description"),
    }

    post.userImg.src = data.profile_photo || "user_default.png"
    post.username.innerText = data.username
    post.postPhoto.src= data.photo
    post.description.innerText = data.description
})

fetch(`/reaction/collect/${postid}`)
.then(res=>{
    return res.json()
})
.then(data=>{
    console.log(data)
    let reactionAvg=0.0
    let counter = 0
    data.map(reaction=>{
        counter++
        reactionAvg+=reaction.reaction_code
    })
    reactionAvg/=counter

    const stats = document.getElementById("reaction-stats")
    stats.innerText = `${counter} (${reactionAvg})`
})

function addReaction(val){
    fetch(`/reaction/add`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            reactionCode:Number(val),
            postId:postid
        })
    })
    .then(res=>{
        return(res.json())
    })
    .then(data=>{
        console.log(data)
    })
}

