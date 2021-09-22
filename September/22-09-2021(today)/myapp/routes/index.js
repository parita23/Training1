const { json } = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/login-process', function(req, res, next) {
  //Get Value From Textbox
  var a = req.body.txt1;
  var pass = req.body.pwd;
  //Session Variable Create
  req.session.username = a;
  req.session.password = pass;
  //Cookie Create
  res.cookie('username',a,{expire : new Date() + 100,httpOnly:true});
  res.cookie('password',pass,{expire : new Date() + 100,httpOnly:true});
  //Check
  console.log( "Sesion Value in Login Process " +  req.session.username);
  console.log( "Sesion Value in Login Process " +  req.session.password);
  //Redirect
  res.redirect('/home');
  
});
router.get('/home', function(req, res, next) {
  //Check Session Variable 
  console.log( "Sesion Value in Home" +  req.session.username);
  console.log( "Sesion Value in Home" +  req.session.password);
  if(req.session.username || req.session.password){
    //Get Value from Session
    var user = req.session.username;
    var pa = req.session.password;

    //Render Page with Username
    res.render('home',{myuser:user});
    res.render('home',{mypass:pa});
    console.log(req.cookies);
  }else{
    //res.send("<h1>Login Required</h1>");
    res.redirect('/login');
  }
});
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    res.clearCookie('username');
    res.clearCookie('password');
    res.redirect('/login');
  });
});
//counter
// router.get('/counter', function(req, res, next) {
//   if(req.session.views){
//     req.session.views++
//     res.setHeader('Content-Type','text/html');
//     res.write('<p>views:'+req.session.views+'</p>');
//     res.write('<p>views:'+(req.session.cookie.maxAge/1000)+'s</p>');
//     res.end();
//   }else{
//     req.session.views=1
//     res.end('welcome to the session demo.refresh!')
//   }
// });

//create cookie
router.get('/create-cookie',function(req, res){
  res.cookie('user' , 'parita');
  res.cookie('rememberme' , '1', {expires : new Date(Date.now()+600000),httpOnly:true});
  res.send('Cookie created');
  });

  router.get('/get-cookie',function(req, res,next){
   let Cookies=JSON.stringify(req.cookies);
   return res.send(Cookies);
    });
    //color task
    router.get('/color', function(req, res, next) {
      res.render('color', { title: 'Express' });
    });

    router.post('/color-process', function(req, res, next) {
      //Get Value From Textbox
      var b = req.body.txt2;
      //Session Variable Create
      req.session.colorname = b;
      //Cookie Create
      res.cookie('colorname',b,{expire : new Date() + 100,httpOnly:true});
      //Check
      console.log( "Sesion Value in color Process " +  req.session.colorname);
      //Redirect
      res.redirect('/page');
      
    });
    router.get('/page', function(req, res, next) {
      //Check Session Variable 
      console.log( "Sesion Value in Home" +  req.session.colorname);
      if(req.session.colorname){
        //Get Value from Session
        var color = req.session.colorname;
        //Render Page with Username
        res.render('page',{mycolor:color});
        console.log(req.cookies);
      }else{
        //res.send("<h1>Login Required</h1>");
        res.redirect('/color');
      }
    });
    //count using cookie
    router.get('/count', function(req, res) {
      if (req.cookies.count) {
          var count = parseInt(req.cookies.count);
      } else {
          var count = 0;
      }
      var counter = count + 1;
      res.cookie('count', counter);
      res.send('Page Visitor Count : ' + counter);
  });
  
module.exports = router;
