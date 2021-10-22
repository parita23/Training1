var express = require('express');
const student_model = require('../models/student_model');
var router = express.Router();


// Model Loading
var UserModel = require('../models/user_model');
var StudentModel = require('../models/student_model');
var EmployeeModel = require('../models/employee_model');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/add', function(req, res, next) {
    res.render('users/add');
});

router.post('/add-process', function(req, res, next) {
    const mybodydata = {
        user_name: req.body.name,
        user_email: req.body.email,
        user_age: req.body.age,
        user_gender: req.body.gender,
        user_birthdate: req.body.birthdate,
        user_mobile: req.body.mobile
    }
    var data = UserModel(mybodydata);

    data.save(function(err) {
        data.save(function(err) {
            if (err) {
                console.log("Error in Add Record" + err);
            } else {
                console.log("Record Added");
                res.render('users/add', { msg: "Record stored successfully" });
            }
        })
    });
});


router.get('/display', function(req, res, next) {
    UserModel.find(function(err, data) {
        if (err) {
            console.log("Error in Fetch Data" + err);
        } else {
            console.log("Record Data is" + data);
            res.render('users/display', { mydata: data });
        }
    }).lean();
});


router.get('/delete/:id', function(req, res, next) {
    var deleteid = req.params.id;
    UserModel.findByIdAndDelete(deleteid, function(err, data) {
        if (err) {
            console.log("Error in Delete" + err);
        } else {
            console.log("Record Deleted" + deleteid);
            res.redirect('/users/display');
        }
    })
    res.render('users/add');
});


router.get('/edit/:id', function(req, res, next) {
    var editid = req.params.id;
    UserModel.findById(editid, function(err, data) {
        if (err) {
            console.log("Error in Edit" + err)
        } else {
            res.render('users/edit', { mydata: data })
        }
    }).lean();
});

router.post('/edit/:id', function(req, res, next) {
    var editid = req.params.id;
    const mybodydata = {
        user_name: req.body.name,
        user_email: req.body.email,
        user_age: req.body.age,
        user_gender: req.body.gender,
        user_birthdate: req.body.birthdate,
        user_mobile: req.body.mobile
    }
    UserModel.findByIdAndUpdate(editid, mybodydata, function(err, data) {
        if (err) {
            console.log("Error in Edit" + err)
        } else {
            console.log(data);
            res.redirect('/users/display');
        }
    }).lean();
});

// --------------------Students Routes

router.get('/addstudent', function(req, res, next) {
    res.render('students/add');
});

router.post('/add-process-student', function(req, res, next) {
    const mybodydata = {
        student_name: req.body.name,
        student_email: req.body.email,
        student_gender: req.body.gender,
        student_birthdate: req.body.birthdate,
        student_mobile: req.body.mobile,
        student_enrollment: req.body.enrollment,
        student_course: req.body.course
    }
    var data = StudentModel(mybodydata);

    data.save(function(err) {
        data.save(function(err) {
            if (err) {
                console.log("Error in Add Record" + err);
            } else {
                console.log("Record Added");
                res.render('students/add', { msg: "Record stored successfully" });
            }
        })
    });
});

router.get('/displaystudent', function(req, res, next) {
    StudentModel.find(function(err, data) {
        if (err) {
            console.log("Error in Fetch Data" + err);
        } else {
            console.log("Record Data is" + data);
            res.render('students/display', { mydata: data });
        }
    }).lean();
});

router.get('/editstudent/:id', function(req, res, next) {
    var editid = req.params.id;
    StudentModel.findById(editid, function(err, data) {
        if (err) {
            console.log("Error in Edit" + err)
        } else {
            res.render('students/edit', { mydata: data })
        }
    }).lean();
});

router.post('/editstudent/:id', function(req, res, next) {
    var editid = req.params.id;
    const mybodydata = {
        student_name: req.body.name,
        student_email: req.body.email,
        student_gender: req.body.gender,
        student_birthdate: req.body.birthdate,
        student_mobile: req.body.mobile,
        student_enrollment: req.body.enrollment,
        student_course: req.body.course
    }
    StudentModel.findByIdAndUpdate(editid, mybodydata, function(err, data) {
        if (err) {
            console.log("Error in Edit" + err)
        } else {
            console.log(data);
            res.redirect('/users/displaystudent');
        }
    }).lean();
});

router.get('/deletestudent/:id', function(req, res, next) {
    var deleteid = req.params.id;
    StudentModel.findByIdAndDelete(deleteid, function(err, data) {
        if (err) {
            console.log("Error in Delete" + err);
        } else {
            console.log("Record Deleted" + deleteid);
            res.redirect('/users/displaystudent');
        }
    })
    res.render('students/display');
});

// -----------------Employees routes
router.get('/addemployee', function(req, res, next) {
    res.render('employees/add');
});

router.post('/add-process-employee', function(req, res, next) {
    var fileobject = req.files.photo;
    var filename = req.files.photo.name;
    const mybodydata = {
        employee_name: req.body.name,
        employee_email: req.body.email,
        employee_birthdate: req.body.birthdate,
        employee_mobile: req.body.mobile,
        employee_hobby: req.body.hobby,
        employee_isadmin: req.body.isadmin,
        employee_photo: filename,
        employee_joindate: req.body.joindate
    }
    var data = EmployeeModel(mybodydata);

    data.save(function(err) {
        data.save(function(err) {
            if (err) {
                console.log("Error in Add Record" + err);
            } else {
                console.log("Record Added");
                fileobject.mv("public/upload/" + filename, function(err) {
                    if (err) throw err;
                    // res.send("File Uploaded");
                    res.render('employees/add', { msg: "Record stored successfully" });
                });
            }
        })
    });
});

router.get('/displayemployee', function(req, res, next) {
    EmployeeModel.find(function(err, data) {
        if (err) {
            console.log("Error in Fetch Data" + err);
        } else {
            console.log("Record Data is" + data);
            res.render('employees/display', { mydata: data });
        }
    }).lean();
});

router.get('/editemployee/:id', function(req, res, next) {
    var editid = req.params.id;
    EmployeeModel.findById(editid, function(err, data) {
        if (err) {
            console.log("Error in Edit" + err)
        } else {
            res.render('employees/edit', { mydata: data })
        }
    }).lean();
});

router.post('/editemployee/:id', function(req, res, next) {
    var fileobject = req.files.photo;
    var filename = req.files.photo.name;
    var editid = req.params.id;
    const mybodydata = {
        employee_name: req.body.name,
        employee_email: req.body.email,
        employee_birthdate: req.body.birthdate,
        employee_mobile: req.body.mobile,
        employee_hobby: req.body.hobby,
        employee_isadmin: req.body.isadmin,
        employee_photo: filename,
        employee_joindate: req.body.joindate
    }
    EmployeeModel.findByIdAndUpdate(editid, mybodydata, function(err, data) {
        if (err) {
            console.log("Error in Edit" + err)
        } else {
            console.log(data);
            fileobject.mv("public/upload/" + filename, function(err) {
                if (err) throw err;
                // res.send("File Uploaded");
                res.redirect('/users/displayemployee');
            });
        }
    }).lean();
});

router.get('/deleteemployee/:id', function(req, res, next) {
    var deleteid = req.params.id;
    EmployeeModel.findByIdAndDelete(deleteid, function(err, data) {
        if (err) {
            console.log("Error in Delete" + err);
        } else {
            console.log("Record Deleted" + deleteid);
            res.redirect('/users/displayemployee');
        }
    })
    res.render('employees/display');
});

module.exports = router;