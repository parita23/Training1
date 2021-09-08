  
$(document).ready(function () {
    // Time Picker JS
    $("#datetimepicker").datetimepicker({
      datepicker: false,
      format: "H:i",
    });
  
   // Datepicker JS
    $("#datepicker").datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: "1950:2021",
    });
  
  // DataTable JS
    $("#example").DataTable({
      dom: "Bfrtip",
      buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
    });
  
   // CK Editor JS
    ClassicEditor.create(document.querySelector("#editor"));
  
  // CK Editor Standard
    var ed = CKEDITOR.replace("editor1");
    ed.on("required", function (evt) {
      $(".introerr").text("This field is required.");
      evt.cancel();
    });
  
  // Chosen JS
    $('#city').chosen();
     $('#hobby').chosen();
  
  $(document).ready(function()
          {
              $("#frm").validate({
                  rules: {
              name: 
              {
                  required : true,
                  minlength: 3,
                  maxlength:10
              },
              mobile:
              {
                  required:true,
                  minlength:10,
                  maxlength:10
              },
              email: {
                  required: true,
                  email: true
              },
             address:{
             required:true,
             maxlength:160
          },
              
             
              datepicker: {
              required: true,
              date: true
              }, 
       city : {
                  required:true
                  
              },
       editor1 : {
                  required:true
                  
              },
      birthtime : {
                  required:true
                  
              },
      
              
          },
          messages: {
              name: "Please enter your name",
              mobile: "Please enter the Mobile No.",
              email: "Please enter a valid email address",
              address:"please enter address",
              city:"please enter city",
              editor:"please enter about yourself",
              datepicker:"please enter valid date",
              timepicker:"please enter valid time",
              hoby:"please select your hoby",
              editor1:"please enter your introduction",
              
               }
              });
              })
  
  function countChar(val) {
              var len = val.value.length;
              if (len >= 160) {
                  alert()
              } else {
                  var ch = 160 - len;
                  $('#charNum').text("Total Charactor:-" + len );
                  $('#re').text("Remaining Charactor:-" + ch );
  
              }
          };
  
   $("#address").on("keyup", function() { 
                   var maxLength = 160;
                   $("#count").text("Characters Entered: " + this.value.length); 
                   var textlen = maxLength - $(this).val().length;
                   $('#rchars').text("Characters Remained: " + textlen);
              }); 
              lightbox.option({
                resizeDuration: 200,
                wrapAround: true,
                fadeDuration: 2000,
                positionFromTop: 130,
              });