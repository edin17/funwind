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