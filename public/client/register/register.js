function registerUser(){
    const registerData = {
        username:window.document.getElementById("username").value,
        email:window.document.getElementById("email").value,
        age:window.document.getElementById("age").value,
        password:window.document.getElementById("password").value,
        repeated_password:window.document.getElementById("repeat-password").value,
    }
    fetch("https://localhost:8000/user/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(registerData)
    })
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        if(typeof(data)==="object"){
            window.location = "/login" 
        }else{
            const errorText = window.document.getElementById("error")
            errorText.style.display="block"
            errorText.innerText=data
        }
    })
}