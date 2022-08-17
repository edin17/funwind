const url = window.document.baseURI;
const urlARR=url.split("/")
const userID = urlARR[4]


fetch(`https://localhost:8000/user/getprofile/${userID}`,{
    method:"GET",
    headers:{
        "Content-Type":"application/json"
    },
})
.then((res)=>{
    return res.json()
})
.then(data=>{
    const userData = data[0]

    const profileInfo = ["age","email","description","posts","profile_date","username"]
    for(let i = 0;i<=profileInfo.length-1;i++){
        document.getElementById(profileInfo[i]).innerText=profileInfo[i] + ": "+userData[profileInfo[i]]
    }
    const profileImg = document.getElementById("profile-photo")
    profileImg.src=userData.profile_photo || "user_default.png"
})

fetch(`https://localhost:8000/post/profileposts/${userID}`,{
    method:"GET"
})
.then(res=>{
    return res.json()
})
.then(data=>{
    data.map(post=>{
        const imgContainer = document.getElementById("posts-container")
        const postImg = document.createElement("img")
        postImg.src=post.photo
        postImg.id="post-img"
        imgContainer.appendChild(postImg)

    })
})

fetch(`https://localhost:8000/follows/followscount/${userID}`,{
    method:"GET"
})
.then(res=>{
    return res.json()
})
.then(data=>{
    const followers = document.getElementById("followers")
    const followings = document.getElementById("followings") 

    followers.innerText="Followers: "+data[0].followings
    followings.innerText="Followings: "+data[1].followings
})

fetch("https://localhost:8000/reaction/reactionstats/20",{
    method:"GET"
})
.then(res=>{
    return res.json()
})
.then(data=>{
    console.log(data)
    let globalAvg=0;
    let globalCount=0;
    let counter=0;
    data.map(el=>{
        globalAvg+=Number(el.avg)
        globalCount+=Number(el.count)
        counter++
    })
    globalAvg=globalAvg/counter
    globalCount=globalCount/counter
    console.log(globalAvg,globalCount)
    const reactionsNum = document.getElementById("reactions")
    const reactionsAvg = document.getElementById("avarage-reaction")
    
    reactionsNum.innerText = "Reactions per post: "+globalCount
    reactionsAvg.innerText = "Average reaction per post: "+globalAvg
    
})

function search(){
    const searched = window.document.getElementById("search").value

    fetch(`https://localhost:8000/user/search/${searched}`,{
        headers:{
            "Accept":"application/json"
        }
    })
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        const header = window.document.getElementById("header")
        const usersList = window.document.createElement("div")
        usersList.id="users-list"
        usersList.style.display="block"
        header.appendChild(usersList)
        const close = document.createElement("button")
        close.id="close"
        close.innerText="C"
        close.addEventListener("click",()=>{
            usersList.remove()
        })
        usersList.appendChild(close)
        data.forEach(el=>{
            const listEl = window.document.createElement("div")
            listEl.className="list-element"
            usersList.appendChild(listEl)
            const userImg = window.document.createElement("img")
            userImg.src=el.profile_photo
            const displayName = window.document.createElement("h3")
            displayName.innerText = el.username
            listEl.appendChild(userImg)
            listEl.appendChild(displayName)
        })


    })
}



const searchBtn = window.document.getElementById("search-btn")
searchBtn.addEventListener("click",search)