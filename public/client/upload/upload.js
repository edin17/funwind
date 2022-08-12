{function uploadPost(){
    const file = window.document.getElementById("file")
    const postInfo = {
        topic:window.document.getElementById("topic"),
        description:window.document.getElementById("description")
    }
    console.log(file.files[0])
    let formData = new FormData()
    formData.append("photo",file.files[0])
    formData.append("topic",postInfo.topic.value)
    formData.append("description",postInfo.description.value)

    fetch("https://localhost:8000/post/create",{
        method:"POST",
        headers:{
            "Content-Type":"multipart/form-data; boundary=<calculated when request is sent>"
        },
        body:formData
    })
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        console.log(data)
    })
}}