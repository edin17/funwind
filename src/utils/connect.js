const {Client} = require("pg")
require("dotenv").config()

const db = new Client({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    port:2000,
    database:process.env.DATABASE,
    password:process.env.DB_PASSWORD
})

module.exports = db