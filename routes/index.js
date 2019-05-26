var express = require('express');
var busboy = require('connect-busboy');
var fs= require('fs');
var router = express.Router();
router.use(busboy())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploadToServer', function(req, res, next) {
  var fileNameToSave;
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('field', function(fieldname, val){
    fileNameToSave = val;
  })
  req.busboy.on('file', function(fieldname, file, filename){
    console.log(file);
    fstream = fs.createWriteStream('./public/files/' + fileNameToSave);
    file.pipe(fstream);
    fstream.on('close', function () {
        console.log("File is saved");
    });
  })
  console.log("Hello");
  return res.status(200).json({
          msg: "Success"
    });
});



module.exports = router;
