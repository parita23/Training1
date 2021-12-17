var express = require('express');
var router = express.Router();
const userModel = require("../models/userModel");
const fileModel = require("../models/fileModel");
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');
const { Parser } = require("json2csv");
var moment = require("moment");
const fs = require("fs");
const multer = require("multer");

const csv = require('csvtojson')

//for uploading the file for importing(using multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/importFile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
//create one jwt token for authentication
function authJWT(req, res, next) {
  let token = req.cookies.token;
  // token = token.split(' ')[1];
  const privateKey = "ujtqcfrdeujbjgdbhghjdbfghdjfuygfbjgfhbfghg";
  jwt.verify(token, privateKey, function (err, user) {
    if (err) {
      res.redirect("/loginApi")
    } else {
      req.user=user
      next();
    }
  })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', authJWT, async function (req, res, next) {
  res.render('signup');
});

router.get('/loginApi', function (req, res, next) {
  //if user once login and go to the signup then they can not go back for  login
  let token = req.cookies.token;
  if (token) {
    res.redirect("/signup")
  }
  res.render('login');
});
//getAllUsers api is created for list all data from database which are already exit in database
router.get('/getAllUsers', authJWT, async function (req, res, next) {
  //find all the data
  let allData = await userModel.find().lean();
  //if for exporting the json to csv file
  if (req.query.type == "exporting") {
    //take fields for which fiels we want to download in csv
    const fields = [
      { lable: "Name", value: "name" },
      { lable: "Email", value: "email" },
      { lable: "Mobile", value: "mobile" },
    ];
    //convert into JSON to CSV for  that we install npm JSON2CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(allData);
    //in fileName store the data in which format you want to dowanload.
    //moment() is used for current time means appent at a time csv.for that we install npm momement
    let fileName =
      "exportData-" + moment().format("YYYY-MM-DD hh:mm") + ".csv";
    console.log("bad luck", fileName)
    //we create one folder csvFile for uploading our csv to that folder
    fs.writeFileSync("public/csvFile/" + fileName, csv)
    res.send({
      type: "success",
      result: allData,
      fileName: fileName,
    });
  }
  res.send({
    type: "success",
    result: allData,
  });
});
//importing the csv to json data and for that we first upload our file to the public folder file
router.post("/import", authJWT, upload.single("file"), async (req, res) => {
  try {
    if (req.file) {
      const temp = {
        name: req.file.filename,
        uploadedBy:req.user.userId,
  
  
      };
      var data = await fileModel.create(temp);
      console.log('data....',data);
      console.log("req.file", req.file)
      
      //csvFilePath is get the path of file which is upload in one file
      const csvFilePath = req.file.destination + "/" + req.file.filename
      console.log("csvFilePath", csvFilePath)
  
      //in jsonArray we get our json file
      const jsonArray = await csv().fromFile(csvFilePath);
      console.log("jsonArrayyyyyyyyyyyyyy", jsonArray);
  
      if(jsonArray){
        
        let firstRow=Object.keys(jsonArray[0])
        let secondRow=Object.values(jsonArray[0])
  
      res.send({
        type: "success",
        firstRow:firstRow,
        secondRow:secondRow,
        id:data._id
      })
      }
    
    }
  } catch (error) {
    console.log("error",error);
  }
 
})

//mapping route

router.post("/mapping/:data", authJWT, async (req, res) => {
 console.log("mapping route..........")
 console.log(req.params.data);
 console.log(req.body)
 
 let data1=await fileModel.findOne({_id:req.params.data})
 console.log("data1",data1);

 const csvFilePath = "./public/importFile/" + data1.name
 console.log("csvFilePath", csvFilePath)

 //in jsonArray we get our json file
 const jsonArray = await csv().fromFile(csvFilePath);
//  console.log("jsonArrayyyyyyyyyyyyyy", jsonArray);

 if(jsonArray){
  let totalRecords=0
  let duplicates=0
  let discarded=0
  let totalUploaded=0
   let mappedArray={}
  

  let jsonKeys=Object.keys(req.body)
  let jsonValues=Object.values(req.body)

  for(let i=0;i<jsonArray.length;i++){
   
    totalRecords++

    // console.log(" after totalll",totalRecords)
    // console.log("iiiiiiiiiii",jsonArray[i])
    for (let key = 0; key < jsonValues.length; key++) {
      let jsonObj = jsonArray[i];


       let mapObj = jsonValues[key];
      
       let keyOfMapObject = jsonKeys[key];
       
       req.body[keyOfMapObject] = jsonObj[mapObj];

      //  console.log("jjjjjjj",keyOfMapObject)
    }
    // console.log("req.body.email..",req.body.email)
    // console.log("req.body.mobile..",req.body.mobile)


    let user = await userModel.findOne({
      //user can login mobile and email both
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }]
    })
    console.log("duplicates..",user)
    // console.log("req.bodyyy",req.body)

    var emailRegExpression = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    if (user) {
      duplicates++;
    } else if (
      emailRegExpression.test(req.body.name) == true ||
      req.body.name == null ||
      req.body.name == ""
    ) {
      console.log("Name is Invalid");
      discarded++;
    } else if (emailRegExpression.test(req.body.email) == false) {
      console.log("Email is Invalid");
      discarded++;
    } else if (
      req.body.mobile.length < 10 ||
      req.body.mobile.length > 10
    ) {
      console.log("Mobile must be 10 digits only.");
      discarded++;
    } else {
      mappedArray.push(req.body);
      totalUploaded++;
    }
  }


      
 
 }

 
})

//signup
router.post("/signup", [
  check("email", "Email length should be 10 to 30 characters")
    .isEmail()
    .isLength({ min: 10, max: 30 }),
  check("name", "Name length should be 10 to 20 characters").isLength({
    min: 2,
    max: 20,
  }),
  check("mobile", "Mobile number should contains 10 digits").isLength({
    min: 10,
    max: 10,
  }),
  check("password", "Password length should be 8 to 10 characters").isLength({
    min: 6,
    max: 10,
  }),
], authJWT, async (req, res) => {

  try {

      //code for add the data
    console.log("req.body", req.body)
  const item = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
  };

  let data = await userModel.findOne({
    //check if email or mobile is already exist or not
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }]
  })
  if (data) {
    res.send({
      type: "error",
      message: "this email or mobile number already used...",
    });
  } else {
    let dataStore = userModel(item);
    dataStore.save(async function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send({
          type: "success",
          result: dataStore,
        });
      }
    });
  }

  console.log(item);
  } catch (error) {
    console.log("error..",error)
  }

  
})
//for login api and route
router.post("/loginApi",
  async (req, res) => {
    try {
      let data = await userModel.findOne({
        //user can login mobile and email both
        $or: [{ email: req.body.email }, { mobile: req.body.email }]
      }).lean();
      console.log("data", data);
      if (data) {
        //if we get the data then we generate the token using jsonwebtoken
        const privateKey = "ujtqcfrdeujbjgdbhghjdbfghdjfuygfbjgfhbfghg";
        //params is used for which field we want to add
        let params = { userId:data._id, email: data.email, name: data.name };

   
        let token = await jwt.sign(params, privateKey, { expiresIn: '8h' });
        if (data.password == req.body.password) {
          //if our password is mach with the database then we send the cookies 
          res.cookie("token", token);
          console.log("token", token);
          // console.log("req.headers.cookie",req.headers.cookie);
          res.send({
            type: "success",
            message: 'message sucessful',
            token: token,
            status: 200
          })

          // res.redirect("/signup")

        } else {
          res.send("password invalid...");
        }
      } else {
        res.send("user not found...");
      }
    } catch (error) {
      console.log(error);
    }
  })

//logout
router.get("/logout", async (req, res) => {
  try {
    //we can clear the cookie for logout which is created at login time
    res.clearCookie("token");
    return res.json({ status: "success", code: 200 });
  } catch (error) {
    //if error then go in error
    console.log(error);
    return res.json({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});


module.exports = router;
