const express = require("express");
const router = express.Router();

// router.route("/login").get((req, res, next) => {

// });

// router.route('/login', (req, res) => {
//   res.sendFile(__dirname + 'login.html');
// });

router.route("/").get((req, res, next) => {
  res.sendFile(__dirname + '/login.html');
});


router.route("/").post((req, res, next) => {
  console.log("user name : ", req.body.username);
  res.cookie("username",req.body.username);
  // console.log("user name : ", req.body.username);
  res.sendFile(__dirname + '/index.html');
  // username = localStorage.setItem("user", req.body.username);
  // username = sessionStorage.setItem("user", req.body.username);
});

module.exports = router;
