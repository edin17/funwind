const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,path.join(__dirname,"..","..","public"))
    }}),
  fileFilter: (req, file, cb) => {
    console.log(file)
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);

  },
  filename:(req,file,cb)=>{
    cb(null, file.originalname)
  }
});