var express = require("express");
var router = express.Router();
const multer = require("multer");
var AjaxModel = require("../schema/validationTable");
const { Parser } = require("json2csv");
var moment = require("moment");
const fs = require("fs");
const nodemailer = require("nodemailer");

//for uploading the image(using multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
//route get for add Ajax form
router.get("/", async function (req, res, next) {
  try {
    let data = await AjaxModel.find().sort({ _id: -1 }).skip(0).limit(3).lean();
    let userCount = await AjaxModel.countDocuments();
    let page = [];
    for (i = 1; i <= Math.ceil(userCount / 3); i++) {
      page[i] = i;
    }
    if (data) {
      res.render("index", { mydata: data, page });
    } else {
      res.send({ type: "error" });
    }
  } catch (error) {
    res.send({ type: "error", error });
  }
});
//when we submit the form that time this add post method called
router.post("/add", upload.single("myfile"), async function (req, res, next) {
  try {
    //take if for check if already data exist then do update else add as a new user
    if (req.body._id) {
      const mybodydata = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        gender: req.body.gender,
        hobbies: req.body.hobbies,
        city: req.body.city,
        myfile: req.body.myfile,
      };
      let data = await AjaxModel.findByIdAndUpdate(req.body._id, mybodydata, {
        new: true,
      });
      if (data) {
        res.send({
          type: "update",
          result: data,
        });
      } else {
        res.send({ type: "error" });
      }
    } else {
      const mybodydata = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        gender: req.body.gender,
        hobbies: req.body.hobbies,
        city: req.body.city,
        myfile: req.body.myfile,
      };
      var data = await AjaxModel(mybodydata).save();
      if (data) {
        res.send({
          type: "success",
          result: data,
        });
      }
    }
  } catch (error) {
    res.send({ type: "error", error });
  }
});
//for edit form data
router.get("/editData/:user_id", async function (req, res) {
  try {
    var data = await AjaxModel.findById(req.params.user_id);
    if (data) {
      res.send({ type: "success", data });
    } else {
      res.send({ type: "error" });
    }
  } catch (error) {
    res.send({ type: "error", error });
  }
});
//delete any data from form
router.get("/userDelete/:user_id", async function (req, res, next) {
  try {
    var data = await AjaxModel.findByIdAndDelete(req.params.user_id);
    if (data) {
      res.send({ type: "success", data });
    } else {
      res.send({ type: "error" });
    }
  } catch (error) {
    res.send({ type: "error", error });
  }
});

//Router for sorting,searching ,pagination,csv Download and csv send to mail
router.post("/sort", async function (req, res) {
  var sort = {};
  try {
    //find total data and count number of records.
    let data = await AjaxModel.find();
    let total = await AjaxModel.find().count();
    //math.ceil method is used for show number of record into one page.
    var page = Math.ceil(total / 3);

    if (req.body.type == "pagination") {
      //skipvalue is used for number of record skip per page
      var skipValue = 3 * (req.body.page - 1);
      //sort[]is used for when we write robo 3t query that type of structure create by following
      sort[req.body.sortingId] = req.body.order;
      //and then sort,skip and limit function fire for pagination and store in data variable
      data = await AjaxModel.find({})
        .sort(sort)
        .skip(skipValue)
        .limit(3)
        .lean();
      res.send({
        type: "success",
        result: data,
        page: page,
      });
    }
    //when type is perform folllowing code is executed
    if (req.body.type == "searching") {
      //take condition object null when search any then push value on this null object
      let condition = {};
      if (req.body.search) {
        condition = {
          //search by firstName or condition
          //regex is used for when we search any 1 or 2 letter then display matches
          //option i used for ignore case means capital or small both are allow
          $or: [
            { firstName: { $regex: req.body.search, $options: "i" } },
            { address: { $regex: req.body.search, $options: "i" } },
          ],
        };
      }

      if (req.body.gender) {
        //search by gender
        condition.gender = req.body.gender;
      }
      //what we can search that pass to our find method
      data = await AjaxModel.find(condition);
      res.send({
        type: "success",
        result: data,
      });
    }
    //when we perform sorting
    if (req.body.type == "sorting") {
      sort[req.body.sortingId] = req.body.order;
      data = await AjaxModel.find({}).sort(sort).limit(3).lean();
      console.log("data", data);
      res.send({
        type: "success",
        result: data,
      });
    }
    //when we perform csv download that time run
    if (req.body.type == "exporting") {
      //take fields for which fiels we want to download in csv
      const fields = [
        { lable: "First name", value: "firstName" },
        { lable: "Last name", value: "lastName" },
        { lable: "Address", value: "address" },
        { lable: "Gender", value: "gender" },
        { lable: "Hobbies", value: "hobbies" },
        { lable: "City", value: "city" },
      ];
      //convert into JSON to CSV for  that we install npm JSON2CSV
      const parser = new Parser({ fields });
      const csv = parser.parse(data);
      //in fileName store the data in which format you want to dowanload.
      //moment() is used for current time means appent at a time csv.for that we install npm momement
      let fileName =
        "exportData-" + moment().format("YYYY-MM-DD hh:mm") + ".csv";
        console.log("bad luck",fileName)
      //we create one folder csvFile for uploading our csv to that folder
      fs.writeFileSync("public/csvFile/" + fileName, csv)
      res.send({
        type: "success",
        result: data,
        fileName: fileName,
      });
    }
    //execute when export to mail button click 
    if (req.body.type == "exportEmail") {
      const fields = [
        { lable: "First name", value: "firstName" },
        { lable: "Last name", value: "lastName" },
        { lable: "Address", value: "address" },
        { lable: "Gender", value: "gender" },
        { lable: "Hobbies", value: "hobbies" },
        { lable: "City", value: "city" },
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(data);
      // console.log(csv);

      let fileName =
        "exportData-" + moment().format("YYYY-MM-DD hh:mm") + ".csv";

      fs.writeFileSync("public/csvFile/" + fileName, csv);
      if (data) {
        let url = "http://127.0.0.1:3000/csvFile/" + fileName;

        async function main() {
          let testAccount = await nodemailer.createTestAccount();
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "test.paritalearning@gmail.com", // generated ethereal user
              pass: "Parita@23", // generated ethereal password
            },
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: "pariganatra232@gmail.com", // sender address
            to: req.body.value, // list of receivers
            subject: "csv file download", // Subject line
            text: "download", // plain text body
            //for attaching csv data as file
            attachments: [
              {
                path: url,
              },
            ],
          });
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        main().catch(console.error);
      } else {
        console.log("error", err);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
