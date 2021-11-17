var express = require("express");
var router = express.Router();
const multer = require("multer");
var AjaxModel = require("../schema/validationTable");

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
    if (data) {
      res.render("index", { mydata: data });
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

//for sort
router.post("/sort", async function (req, res) {
  
  var sort = {};
  try {
    console.log(req.body);
    if(req.body.type == "pagination"){
      
      var skipValue= 3 *(req.body.page-1);
      console.log("skippppp",skipValue);
      sort[req.body.sortingId] = req.body.order;
      var data = await AjaxModel.find({}).sort(sort).skip(skipValue).limit(3).lean();
      res.send({
        type: "success",
        result: data,
      });
    }else if(req.body.type == "searching"){
      const mybodydata = {
        search: req.body.search,
      };
      console.log("myff",mybodydata)
    } 
    else{
      sort[req.body.sortingId] = req.body.order;
      console.log("sort",sort);
       var data = await AjaxModel.find({}).sort(sort).limit(3).lean();
      console.log("data",data);
      res.send({
        type: "success",
        result: data,
      });

    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
