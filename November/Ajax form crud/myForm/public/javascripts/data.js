$(document).ready(() => {
  let userId;
  //validation
  $("#formEx").validate({
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      address: {
        required: true,
      },
      gender: {
        required: true,
      },
      hobbies: {
        required: true,
      },
      city: {
        required: true,
      },
      myfile:{
          required:true
      }
    },
    messages: {
      firstName: {
        required: "Please enter your first name",
      },
      lastName: {
        required: "Please enter your last name",
      },
      address: {
        required: "Please enter your address ",
      },
      gender: {
        required: "Please select your gender ",
      },
      hobbies: {
        required: "Please select your hobbies ",
      },
      city: {
        required: "Please select any city",
      },
      myfile:{
          required:"please select any image file"
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
      //using id
      /* {{!-- if (element.attr("id") == "floatingInput" ) {
                         error.appendTo($("#message1"));
                     } 
                    else if (element.attr("id") == "floatingInput1" ) {
                         error.appendTo($("#message2"));
                     }
                     else if (element.attr("id") == "floatingPassword" ) {
                         error.appendTo($("#message3"));
                     } 
                     else {
                         error.insertAfter(element)
                     } --}}*/
        error.insertAfter(element.parent());
    },
    submitHandler: function (form, event) {
      
      event.preventDefault();
      //object for appending
      var demoData = new FormData();
      demoData.append("myfile", $("#myfile")[0].files[0]);
      //check data already exist or not
      let b = $(".editUser").attr("id");
      if (b != "submituser") {
        demoData.append("_id", b);
      }
      //for printing the multiple hobbies
      var hobbyArray = [];
      $("#formEx input:checkbox:checked").each(function () {
        hobbyArray.push($(this).val());
      });

      var myObj = {
        firstName: $("#floatingInput").val(),
        lastName: $("#floatingInput2").val(),
        address: $("#textArea").val(),
        gender: $('input[name="gender"]:checked').val(),
        hobbies: hobbyArray,
        city: $("#myCity").val(),
        myfile: $("#myfile")[0].files[0].name,
      };
      console.log(myObj);
      //for getting one bye one key and value from above object
      for (let key in myObj) {
        demoData.append(key, myObj[key]);
      }
      //Ajax for adding the form
      $.ajax({
        url: "/add",
        type: "POST",
        data: demoData,
        contentType: false,
        processData: false,
        success: function (data) {
          if (data.type == "success") {
            var temp = `
            <tr class="${data.result._id}">
                <td><img src="/images/${data.result.myfile}" style="width: 100px;"/></td>
                <td>${data.result.firstName}</td>
                <td>${data.result.gender}</td>
                <td>${data.result.address}</td>
                <td><button id="${data.result._id}" class="edit">Edit Details</button>
                <button class="delete" id="${data.result._id}">Delete Item</button></td>
            </tr>`;
            $('#bodyAppend').append(temp);
          }

          if(data.type == "update"){
            var temp2 = `
            <tr class="${data.result._id}">
                <td><img src="/images/${data.result.myfile}" style="width: 100px;" /></td>
                <td>${data.result.firstName}</td>
                <td>${data.result.gender}</td>
                <td>${data.result.address}</td>
                <td><button id="${data.result._id}" class="edit">Edit Details</button>
                <button class="delete" id="${data.result._id}">Delete Item</button></td>
            </tr>`

            $("." + data.result._id).replaceWith(temp2);
            $(".edit").attr("disabled", false);
          }
          
        },
        // error: function (e) {
        //   console.log(e);
        // },
      });
    },
  });
  //Ajax call for edit
  $(".edit").on("click", function () {
    let user_id = $(this).attr("id");
    userId = user_id;
    $(".edit").attr("disabled", true);
    $.ajax({
      url: "/editData/" + user_id,
      type: "GET",
      contentType: false,
      processData: false,
      success: function (data) {
        console.log("edit data is : ", data);
        $("#floatingInput").val(data.data.firstName);
        $("#floatingInput2").val(data.data.lastName);
        $("#textArea").val(data.data.address);
        $("#" + data.data.gender).attr("checked", true);

        let hobbies = data.data.hobbies.split(",");
        $("#hobbies")
            .find("[value=" + hobbies.join("], [value=") + "]")
            .prop("checked", true);

        $("#myCity").val(data.data.city);
        $(
          '<img class="image" src="/images/' +
            data.data.myfile +
            '" style="width: 100px;"/>'
        ).insertAfter("#myfile");
        $("#submituser").attr("id", user_id).html("Edit user");
      },
      error: function (e) {
        console.log(e);
      },
    });
  });
  //reset the form
  $("#configreset").click(function () {
    $("#formEx")[0].reset();
  });
  //delete the data
  $(document)
    .off("click", ".delete")
    .on("click", ".delete", function () {
      let user_id = $(this).attr("id");
      $.ajax({
        url: "/userDelete/" + user_id,
        method: "GET",
      }).done(function (data) {
        $("tr." + user_id).remove();
      });
    });
});
