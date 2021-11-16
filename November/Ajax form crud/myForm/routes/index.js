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
    var data = await AjaxModel.find().lean();
    if (data) {
      res.render("index", { mydata: data });
    } else {
      res.send({type:"error"});
    }
  } catch (error) {
    res.send({type:"error", error});
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
        res.send({type:"error"});
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
    res.send({type:"error", error});
  }
});
//for edit form data
router.get("/editData/:user_id", async function (req, res) {
  try {
    var data = await AjaxModel.findById(req.params.user_id);
    if (data) {
      res.send({ type: "success", data });
    } else {
      res.send({type:"error"});
    }
  } catch (error) {
    res.send({type:"error", error});
  }
});
//delete any data from form 
router.get("/userDelete/:user_id", async function (req, res, next) {
  try {
    var data = await AjaxModel.findByIdAndDelete(req.params.user_id);
    if (data) {
      res.send({ type: "success", data });
    } else {
      res.send({type:"error"});
    }
  } catch (error) {
    res.send({type:"error", error});
  }
});

//for sort
router.post("/sort", async function (req, res) {
  try {
    
    // sortingBy=req.body.sortingBy
    // order=req.body.order
    var sort={}
    sort[req.body.sortingBy]=req.body.order;
    var data = await AjaxModel.find().sort(sort);
    console.log("qqqq",data);
    if (data) {
      res.send({
        type: "success",
        result: data,
      });
    }
    else{
      console.log("error");
    }

  } catch (error) {
    res.send({type:"error", error});
  }
});

module.exports = router;
