var express = require("express");
var router = express.Router();
const userModel = require("../models/userModel");
const fileModel = require("../models/fileModel");
const fieldModel = require("../models/fieldModel");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const { Parser } = require("json2csv");
var moment = require("moment");
const fs = require("fs");
const multer = require("multer");

const csv = require("csvtojson");

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
      res.redirect("/loginApi");
    } else {
      req.user = user;
      next();
    }
  });
}

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/signup", authJWT, async function (req, res, next) {
  res.render("signup");
});

router.get("/loginApi", function (req, res, next) {
  //if user once login and go to the signup then they can not go back for  login
  let token = req.cookies.token;
  console.log("token...",token);
  if (token) {
    res.redirect("/signup");
  }
  res.render("login");
});
//getAllUsers api is created for list all data from database which are already exit in database
router.get("/getAllUsers", authJWT, async function (req, res, next) {
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
    let fileName = "exportData-" + moment().format("YYYY-MM-DD hh:mm") + ".csv";
    //we create one folder csvFile for uploading our csv to that folder
    fs.writeFileSync("public/csvFile/" + fileName, csv);
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
router.post("/import",  authJWT, upload.single("file"), async (req, res) => {
  try {
    //in if we get the user.userId from loginApi and generate in authjWt
    console.log(req.file,"mmmmmmmm");
    if (req.file) {
      console.log("11111");
      const temp = {
        name: req.file.filename,
        uploadedBy: req.user.userId,
      };
      
      var data = await fileModel.create(temp);
      //in below array we have already in our database
      let dbfields = ["name", "email", "mobile"];
      //in this we find all the new fields added in fieldModel
      let allField = await fieldModel.find();
      //map method take array of object
      allField = allField.map(function(field){
        return field.field
      })
      //we concat our field array and (name,email,mobile) array 
  
      let alldbFields = dbfields.concat(allField);
     
      //csvFilePath is get the path of file which is upload in one file
     
      const csvFilePath = req.file.destination + "/" + req.file.filename;
      
      //in jsonArray we get our json file
     
      const jsonArray = await csv({noheader : true}).fromFile(csvFilePath);
      console.log("jsonArray..")
     
      if (jsonArray) {
       
        let fields = Object.keys(jsonArray[0]);
        let firstRow = Object.values(jsonArray[0]);
        console.log("firstRow.",firstRow)
        let secondRow = Object.values(jsonArray[1]);
        console.log("secondRow.",secondRow)
       
        console.log("allfield");
        res.send({
          type: "success",
          firstRow: firstRow,
          fields : fields,
          secondRow: secondRow,
          alldbFields : alldbFields,
          id: data._id,
         
        });
      }
    } else {
      console.log("rt5t55r3ft")
      res.json({
        status: "error",
        code: 404,
        message: "file not found",
      });
    }
  } catch (error) {
  console.log(error)
    res.json({
      status: "error",
      code: 404,
      message: "data not found",
    });
  }
});

//mapping route for compare database and csv field
///mapping/:data in data we get id from ajax and access as req.params
router.post("/mapping/:data/:checkValue", authJWT, async (req, res) => {
  console.log("andar aave")

  try {
      // console.log("jsonArray......",jsonArray)
      var skipVal = await fileModel.updateOne({_id:req.params.data},{$set:{skipFirstRow:"true",fieldMappingObject:req.body,status:"pending"}})
      console.log("skipVal..",skipVal)
    }catch (error) {
    console.log("Error",error)
    res.json({
      status: "error",
      code: 404,
      message: "File not convert CSV to JSON",
    });
  }
});

//add field route

router.post("/fieldAdd",authJWT,async (req, res) => {
    try {
     console.log("andar...................")

     let mybodydata = {
      field:req.body.field
    };
         
     
      console.log("mybodydata....",mybodydata)
      var fieldResult= await fieldModel(mybodydata).save();


      let allData = await fieldModel.find().lean();
      // console.log("data1,",fieldResult)
      console.log("allData..,",allData)
      if (allData) {
        res.send({
          type: "success",
          result: allData
        });
      }else{
        console.log("error to save the data")
      }

      
    } catch (error) {
      console.log("errorrrr", error)
    }
  }
);
//signup
router.post(
  "/signup",
  [
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
  ],
  authJWT,
  async (req, res) => {
    try {
      //code for add the data
      const item = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
      };

      let data = await userModel.findOne({
        //check if email or mobile is already exist or not
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      });
      console.log("data male",data)
      if (data) {
        res.send({
          type: "error",
          message: "this email or mobile number already used...",
        });
      } else {
        let dataStore = userModel(item);
        dataStore.save(async function (err, result) {
          if (err) {
            res.json({
              status: "error",
              code: 404,
              message: "error",
            });
          } else {
            res.send({
              type: "success",
              result: dataStore,
            });
          }
        });
      }

    } catch (error) {
      res.json({
        status: "error",
        code: 404,
        message: "something went wrong",
      });
    }
  }
);
//for login api and route
router.post("/loginApi", async (req, res) => {
  try {
    let data = await userModel
      .findOne({
        //user can login mobile and email both
        $or: [{ email: req.body.email }, { mobile: req.body.email }],
      })
      .lean();
    if (data) {
      //if we get the data then we generate the token using jsonwebtoken
      const privateKey = "ujtqcfrdeujbjgdbhghjdbfghdjfuygfbjgfhbfghg";
      //params is used for which field we want to add
      let params = { userId: data._id, email: data.email, name: data.name };

      let token = await jwt.sign(params, privateKey, { expiresIn: "8h" });
      if (data.password == req.body.password) {
        //if our password is mach with the database then we send the cookies
        res.cookie("token", token);
  
        res.send({
          type: "success",
          message: "message sucessful",
          token: token,
          status: 200,
        });

        // res.redirect("/signup")
      } else {
        res.send("password invalid...");
      }
    } else {
      res.send("user not found...");
    }
  } catch (error) {
    res.json({
      status: "error",
      code: 404,
      message: "something went wrong",
    });
  }
});

//logout
router.get("/logout", async (req, res) => {
  try {
    //we can clear the cookie for logout which is created at login time
    res.clearCookie("token");
    return res.json({ status: "success", code: 200 });
  } catch (error) {
    //if error then go in error
    res.json({
      status: "error",
      code: 404,
      message: "something went wrong",
    });
    return res.json({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

//status check route

router.get("/statusCheck", async (req, res) => {
  try {
    console.log("annnnnnnnnn")
    let userData = await fileModel.find();
    console.log("usersDataaaa",userData)

    if(userData){
      res.json({
        status: "sucess",
        code: 200,
        userData:userData
      });
    }else{
      console.log("Error to fetch data")
    }
  } catch (error) {
    //if error then go in error
    res.json({
      status: "error",
      code: 404,
      message: "something went wrong",
    });
  }
});


module.exports = router;
