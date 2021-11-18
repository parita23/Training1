var sortingOrder;
var sortingParameter;
var page;
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
      myfile: {
        required: true,
      },
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
      myfile: {
        required: "please select any image file",
      },
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
            $("#bodyAppend").append(temp);
          }

          if (data.type == "update") {
            var temp2 = `
            <tr class="${data.result._id}">
                <td><img src="/images/${data.result.myfile}" style="width: 100px;" /></td>
                <td>${data.result.firstName}</td>
                <td>${data.result.gender}</td>
                <td>${data.result.address}</td>
                <td><button id="${data.result._id}" class="edit">Edit Details</button>
                <button class="delete" id="${data.result._id}">Delete Item</button></td>
            </tr>`;

            $("." + data.result._id).replaceWith(temp2);
            $(".edit").attr("disabled", false);
          }
          $("#formEx")[0].reset();
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

  //sort by name

  $(".name").on("click", function () {
    sortingOrder = $(this).attr("sortingOrder");
    sortingParameter = $(this).attr("id");
    var obj = {
      type: "sorting",
      order: $(this).attr("sortingOrder"),
      sortingId: $(this).attr("id"),
    };
    if ($(this).attr("sortingOrder") == 1) {
      $(this).attr("sortingOrder", -1);
    } else {
      $(this).attr("sortingOrder", 1);
    }
    $.ajax({
      url: "/sort",
      method: "POST",
      data: obj,
      success: function (data) {
        console.log("data", data);
        $("#bodyAppend").empty();
        for (var test of data.result) {
          console.log("hhh", test.firstName);
          var temp3 = `
            <tr class="${test._id}">
                <td><img src="/images/${test.myfile}" style="width: 100px;"/></td>
                <td>${test.firstName}</td>
                <td>${test.gender}</td>
                <td>${test.address}</td>
                <td><button id="${test._id}" class="edit">Edit Details</button>
                <button class="delete" id="${test._id}">Delete Item</button></td>
            </tr>`;
          $("#bodyAppend").append(temp3);
        }
      },
    });
  });

  $(document)
    .off("click", ".pageClick")
    .on("click", ".pageClick", function () {
      console.log("sortingOrder", sortingOrder);
      console.log("sortingParameter", sortingParameter);
      page = $(this).attr("page");
      console.log(page);
      let pageObj = {
        type: "pagination",
        page: $(this).attr("page"),
        order: sortingOrder,
        sortingId: sortingParameter,
      };
      $.ajax({
        url: "/sort",
        type: "POST",
        data: pageObj,
        success: function (data) {
          console.log("aaaaaaaaaaaaaaaaa", data);
          if (data.type == "success") {
            $("#bodyAppend").empty();
            if (data.result) {
              for (var test of data.result) {
                var temp4 = `
                <tr class="${test._id}">
                    <td><img src="/images/${test.myfile}" style="width: 100px;"/></td>
                    <td>${test.firstName}</td>
                    <td>${test.gender}</td>
                    <td>${test.address}</td>
                    <td><button id="${test._id}" class="edit">Edit Details</button>
                    <button class="delete" id="${test._id}">Delete Item</button></td>
                </tr>`;
                $("#bodyAppend").append(temp4);
              }

              $(".pagination").empty();
              for (var i = 1; i <= data.page; i++) {
                var temp4 = `<li class="page-item"><a class="page-link pageClick" id="${i}" page="${i}">${i}</a></li>`;
                $(".pagination").append(temp4);
              }
            }
          }
        },
        error: function (err) {
          console.log(err);
        },
      });
    });
  $(".se").on("click", function () {
    console.log("ggg");
    var myObj = {
      type: "searching",
      search: $(".search").val(),
      gender: $("#gender").val(),
    };
    console.log("search", myObj);
    $.ajax({
      url: "/sort",
      method: "POST",
      data: myObj,
      success: function (data) {
        console.log("data", data);
        if (data.type == "success") {
          $("#bodyAppend").empty();
          if (data.result) {
            for (var test of data.result) {
              var temp5 = `
                <tr class="${test._id}">
                    <td><img src="/images/${test.myfile}" style="width: 100px;"/></td>
                    <td>${test.firstName}</td>
                    <td>${test.gender}</td>
                    <td>${test.address}</td>
                    <td><button id="${test._id}" class="edit">Edit Details</button>
                    <button class="delete" id="${test._id}">Delete Item</button></td>
                </tr>`;
              $("#bodyAppend").append(temp5);
            }
          }
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});
