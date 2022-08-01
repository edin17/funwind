const db = require("./connect")

function deleteBlackList(){
    setInterval(()=>{
        db.query(`DELETE FROM blacklist WHERE exp_date < NOW()`)
        console.log("Deleted expired rows from blacklist.")
    },86400)
    
}


module.exports = {
    deleteBlackList
}