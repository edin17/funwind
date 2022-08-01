const https = require("https");
const fs = require("fs");
const app = require("./app");
const path = require("path")
const db = require("./utils/connect")
require("dotenv").config()
const PORT = Number(process.env.PORT)

const server = https.createServer({
    key:fs.readFileSync(path.join(__dirname,"..","key.pem")),
    cert:fs.readFileSync(path.join(__dirname,"..","certificate.pem"))
},app)

db.connect()

server.listen(PORT,()=>{
    console.log("Server listening on port "+PORT)
})