$(Document).ready(() => {
  //for list all the users
  $.ajax({
    url: "/getAllUsers",
    type: "GET",
    success: function (data) {
      //for get the single data from array
      for (const user of data.result) {
        let temp1 = `<tr>
                    <td scope="col">${user.name}</td>
                    <td scope="col">${user.email}</td>
                    <td scope="col">${user.mobile}</td>
                    </tr>`;
        $("#bodyAppend").append(temp1);
      }
    },
  });
  //for export the csv file
  $(".export").on("click", function () {
    var myObj = {
      type: "exporting",
    };
    $.ajax({
      url: "/getAllUsers",
      method: "GET",
      data: myObj,
      success: function (data) {
        var link = $("<a />");
        link.attr("download", "parita.csv");
        let url = "http://127.0.0.1:3000/csvFile/" + data.fileName;
        link.attr("href", url);
        $("body").append(link);
        link[0].click();
        $("body").remove(link);
      },
      error: function (err) {
        console.log(err);
      },
    });
  });

  //for logout
  $(".logout").click(function () {
    $.ajax({
      type: "GET",
      url: "logout",
    }).done(function (data) {
      //if status is sucess go in if condition
      if (data.status == "success") {
        //we want to redirect into loginApi route when click on the logout button
        $(location).attr("href", "/loginApi");
      } else {
        $("#errorMessage").html(data.message);
      }
    });
  });
  $.validator.addMethod("nameTest", function (value) {
    return /^[a-zA-Z]+$/.test(value); // consists of only these
  });
  $.validator.addMethod("emailTest", function (value) {
    return /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value); // consists of only these
  });

  //for our mobile format
  $("#floatingMobile").usPhoneFormat({
    format: "xxx-xxx-xxxx",
  });

  //fr validate our signup form
  $("#myform").validate({
    rules: {
      name: {
        required: true,
        nameTest: true,
      },
      email: {
        required: true,
        emailTest: true,
      },
      password: {
        required: true,
        min: 6,
      },
      mobile: {
        required: true,
      },
    },
    messages: {
      name: {
        required: "Please enter your name",
        nameTest: "enter only chr.",
      },
      email: {
        required: "Please enter your email",
        emailTest: "enter proper email address with @ charster and digit",
      },

      password: {
        required: "Please enter your password",
        min: "password must be minimum 6 character",
      },
      mobile: {
        required: "Please enter your mobile number",
      },
    },
    highlight: function (element) {
      $(element).addClass("errorClass");
    },
    unhighlight: function (element) {
      $(element).removeClass("errorClass");
    },
    //when we want to place our error message
    errorPlacement: function (error, element) {
      if ($(element).attr("name") == "name") {
        error.insertAfter(element.parent());
      } else if ($(element).attr("name") == "email") {
        error.insertAfter(element.parent());
      } else if ($(element).attr("name") == "password") {
        error.insertAfter(element.parent());
      } else if ($(element).attr("name") == "mobile") {
        error.insertAfter(element.parent());
      }
    },
    submitHandler: function (form, event) {
      //gets the value of every field
      var myObj = {
        name: $("#floatingInput").val(),
        email: $("#floatingInput1").val(),
        mobile: $("#floatingMobile").val(),
        password: $("#floatingPassword").val(),
      };
      console.log("myObj", myObj);

      $.ajax({
        url: "/signup",
        type: "POST",
        data: myObj,
        success: function (data) {
          //for appending our data
          var temp = `
    <tr class="${data.result._id}">
        <td>${data.result.name}</td>
        <td>${data.result.email}</td>
        <td>${data.result.mobile}</td>
        
    </tr>`;
          $("#bodyAppend").append(temp);
        },
      });
    },
  });
  //field add
  let objValidation = {};
  $(document).on("change", ".dbSelect", function () {
      console.log("mmmmmmm")
    
    if (objValidation.hasOwnProperty($(this).val())) {
      alert("already selected...");
      let prev = $(this).attr("name");
      console.log("prevvvv", prev);
      $(this).val(prev).attr("selected", true);
    } else {
      let prev = $(this).attr("name");

      console.log("previous", prev);
      $(this).attr("name", $(this).val());
      if ($(this).val() == "") {
        delete objValidation[prev];
      } else {
        delete objValidation[prev];
        objValidation[$(this).val()] = 1;
      }
    }
    if ($(this).val() === "add") {
      let field = prompt("Enter new field");
      console.log("myObjmyObjmyObj", field);
      if (field != null) {
        $.ajax({
          url: "/fieldAdd",
          type: "POST",
          data: { field },
        }).done(function (data) {
          console.log("dataaaa", data);
          if (data.type == "success") {
            $(".form-select").append(
              `<option value='${field}'>${field}</option>`
            );
          }
        });
      }
    }
  });
  //for validate our choose file form (import task)
  $("#importForm").validate({
    rules: {
      file: {
        required: true,
        extension: "csv",
      },
    },
    messages: {
      file: {
        required: "Please select the file",
        extension: "please select csv file",
      },
    },
    highlight: function (element) {
      $(element).addClass("errorClass");
    },
    unhighlight: function (element) {
      $(element).removeClass("errorClass");
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element.parent());
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      //for taking file data
      var demoData = new FormData();
      demoData.append("file", $("#file")[0].files[0]);

      // var checkValue=$("#importForm input:checkbox:checked").val()
      // var checkValue= $('input[name="check"]:checked').val()
      // var checkValue=$('input[name="check"]:checked').val()
      // console.log("checkValue.",checkValue)

      $.ajax({
        url: "/import",
        type: "POST",
        data: demoData,
        contentType: false,
        processData: false,
      }).done(function (data) {
        //take options as a blank field
        let options = "";
        for (let field of data.alldbFields) {
          options = options + `<option value='${field}'>${field}</option>`;
        }

        //set Data lable id as fileId
        $(".dataId").attr("fileId", data.id);
        //for appending the dropdown and checkbox
        for (let index = 0; index < data.firstRow.length; index++) {
          $(".csvTbl").append(
            "<tr class='table-danger'> <td><input type='checkbox' name='check' value=" +
              data.fields[index] +
              " class='form-check-input' ></td> <td>" +
              data.firstRow[index] +
              "</td> <td>" +
              data.secondRow[index] +
              "</td> <td>  <select name='' class='form-select dbSelect'id=" +
              data.fields[index] +
              "-dropdown > <option value=''>Select Value</option> " +
              options +
              " <option class='press' value='add'>Add Field</option></select></td></tr>"
          );
        }
      });
    },
  });

  // $(document).ready(function(){
  //     $('.d').on("change",".dbSelect",function(){
  //         alert("addd")
  //     });
  //   });

  //upload click event
  $(".upload").click(function () {
    //we set our fileId to as form class dataId
    let fileId = $(".dataId").attr("fileId");

    var checkValue = $('input[name="a"]:checked').val();
    console.log("checkValue.", checkValue);

    let fieldMap = {};
    $("input[name='check']:checked").each(function () {
      let checkboxval = $(this).val();
      let dropdownVal = $(`#${checkboxval}-dropdown option:selected`).val();
      fieldMap[dropdownVal] = checkboxval;
    });

    //we get the value of checkbox and dropDown value and put as fieldMap[checkboxval] = dropdownVal
console.log(fieldMap,"nnnnnnnnnnnnnnnnjkyujn");
    //for mapping ajax call
    $.ajax({
      url: "/mapping/" + fileId + "/" + checkValue,
      type: "POST",
      data: fieldMap,
    }).done(function (data) {
      console.log("dataaaaaaaaaa", data);
    });
  });
});
