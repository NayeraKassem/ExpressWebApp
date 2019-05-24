var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploadToServer', function(req, res, next) {
  console.log("Hello");
  console.log(req.data);
  return res.status(200).json({
          msg: "Success"
    });
});



module.exports = router;
