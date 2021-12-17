$(Document).ready(() => {
    //for list all the users 
    $.ajax({
        url: "/getAllUsers",
        type: "GET",
        success: function (data) {
            console.log("hiiiii")
            console.log("data", data);
            //for get the single data from array
            for (const user of data.result) {
                let temp1 = `<tr>
                    <td scope="col">${user.name}</td>
                    <td scope="col">${user.email}</td>
                    <td scope="col">${user.mobile}</td>
                    </tr>`;
                $("#bodyAppend").append(temp1);
            }

        }

    });
    //for export the csv file
    $(".export").on("click", function () {
        console.log("click")
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
                console.log("data.fileName", data.fileName)
                let url = "http://127.0.0.1:3000/csvFile/" + data.fileName;
                console.log("url", url)
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

        return /^[a-zA-Z]+$/.test(value) // consists of only these
    });
    $.validator.addMethod("emailTest", function (value) {

        return /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value) // consists of only these
    });

    //for our mobile format
    $('#floatingMobile').usPhoneFormat({
        format: 'xxx-xxx-xxxx',
    });

    //fr validate our signup form
    $("#myform").validate({
        rules: {
            name: {
                required: true,
                nameTest: true
            },
            email: {
                required: true,
                emailTest: true,

            },
            password: {
                required: true,
                min: 6

            },
            mobile: {
                required: true,
            }
        },
        messages:
        {
            name: {
                required: "Please enter your name",
                nameTest: "enter only chr."
            },
            email: {
                required: "Please enter your email",
                emailTest: "enter proper email address with @ charster and digit",
            },

            password: {
                required: "Please enter your password",
                min: "password must be minimum 6 character"

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
            console.log('dd', element.attr("name"))

            if ($(element).attr('name') == 'name') {
                error.insertAfter(element.parent());
            }
            else if ($(element).attr('name') == 'email') {
                error.insertAfter(element.parent());
            }
            else if ($(element).attr('name') == 'password') {
                error.insertAfter(element.parent());
            }
            else if ($(element).attr('name') == 'mobile') {
                error.insertAfter(element.parent());
            }
        },
        submitHandler: function (form, event) {

            //gets the value of every field
            var myObj = {
                name: $("#floatingInput").val(),
                email: $("#floatingInput1").val(),
                mobile: $("#floatingMobile").val(),
                password: $("#floatingPassword").val()
            }
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

                }

            });

        },

    });
    //for validate our choose file form (import task)
    $("#importForm").validate({
        rules: {
            file: {
                required: true,
                extension: "csv"
            }
        },
        messages:
        {
            file: {
                required: "Please select the file",
                extension: "please select only csv file"

            }

        },
        highlight: function (element) {
            $(element).addClass("errorClass");
        },
        unhighlight: function (element) {
            $(element).removeClass("errorClass");
        },
        errorPlacement: function (error, element) {
            console.log("dd", element.attr("name"));

            error.insertAfter(element.parent());
        },
        submitHandler: function (form, event) {
            event.preventDefault();

            var demoData = new FormData();
            demoData.append("file", $("#file")[0].files[0]);

            $.ajax({
                url: "/import",
                type: "POST",
                data: demoData,
                contentType: false,
                processData: false
            }).done(function (data) {
                console.log("hiiiii");
                console.log("datadata",data)
                $(".dataId").attr("fileId", data.id);

                for (let index = 0; index < data.firstRow.length; index++) {
                    
                    $('.csvTbl').append("<tr class='table-danger'> <td><input type='checkbox' value=" + data.firstRow[index] + " class='form-check-input' ></td> <td>" + data.firstRow[index] + "</td> <td>" + data.secondRow[index] +
                        "</td> <td>  <select class='form-select'id=" + data.firstRow[index] + "-dropdown > <option value='' disabled >Select Value</option> <option value='name'>name</option> <option value='email'>email</option> <option value='mobile'>mobile</option> </select></td></tr>");
                };
            });

            //execute when click on export for csv download
        },

    })

    $(".upload").click(function () {
        console.log("upload button click")
        let fileId = $(".dataId").attr("fileId");
       
        var keyArray = [];
        $("input:checkbox:checked").each(function () {
            keyArray.push($(this).val());
          });
          
          console.log("keyArray...",keyArray);
         
          let fieldMap = {}
            $("input:checked").each(function () {
                let checkboxval = $(this).val()
                console.log('check -------- ', checkboxval);
                let dropdownVal = $(`#${checkboxval}-dropdown option:selected`).val();
                console.log('dropdown value -------- ',dropdownVal);
                fieldMap[checkboxval] = dropdownVal;
            
            });
            console.log('fieldMap-------', fieldMap,fileId)


            $.ajax({
                url: "/mapping/"+fileId,
                type: "POST",
                data: fieldMap
            }).done(function (data) {
                console.log("dataaaaaaaaaa",data);
            });
    });
});