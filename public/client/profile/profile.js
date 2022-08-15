fetch("https://localhost:8000/user/getprofile/15",{
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

    const profileInfo = ["age","email","description","profile_date","username"]
    for(let i = 0;i<=profileInfo.length-1;i++){
        document.getElementById(profileInfo[i]).innerText=profileInfo[i] + ": "+userData[profileInfo[i]]
    }
    const profileImg = document.getElementById("profile-photo")
    profileImg.src=userData.profile_photo
}
)