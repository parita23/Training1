var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express js demo 123' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express' });
});

router.get('/people', (req, res) => {
  res.render('people', { peoples: [
  { name: 'user1'},
  { name: 'user2'},
  ]});
  });

  router.get('/form', function(req, res, next) {
    res.render('form', { title: 'Express' });
  });
  
  router.post('/form', function(req, res, next) {
    console.log(req.files.file123);
    var myfile = req.files.file123; //File Object
    var myfilename = req.files.file123.name; //Get File Name
    var myfilesize = req.files.file123.size; //Get File Name
    var myfilemimetype = req.files.file123.mimetype; //Get File Name
    //task 1 only images are uploaded
    if(req.files.file123.mimetype=="image/jpeg")
        {
          myfile.mv('public/upload/'+myfilename, function(err) {
          if (err)
            return res.status(500).send(err);
            res.send('File uploaded!');
        });
        }
        else
        {
            res.send('File Sorry!');
        }//

        //task only less than 2 mb file uploaded
        if(req.files.file123.size < 2 * 1024 * 1024)
          {
            myfile.mv('public/upload/'+myfilename, function(err) {
              if (err)
                return res.status(500).send(err);
                res.send('File uploaded!');
            });
          }
            else
            {
            res.send('Max File size 2 MB Only');
            }
    //File Upload Code
    myfile.mv('public/upload/'+myfilename, function(err) {
    if (err)
    return res.status(500).send(err);
    //res.send('File uploaded!');
    });

  });
  
 

module.exports = router;
