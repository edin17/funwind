
const loginBtn = window.document.getElementById("submit-btn")
function loginUser(){
    const loginData = {
        username:window.document.getElementById("username").value,
        password:window.document.getElementById("password").value
    }

    fetch("https://localhost:8000/user/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(loginData)
    })
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        if(typeof(data)==="object"){
            window.location = "/upload"
        }else{
            const errorText = window.document.getElementById("error")
            errorText.style.display="block"
            errorText.innerText=data
        }
    })
    console.log(loginData)
}
    