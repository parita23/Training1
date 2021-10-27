$(document).ready(function(){
   $('#button').click(function(){
      let store=$("#name").val();
      $.post("demo1.js",{vall:store},function(feedback){
          $(".msg").html(feedback);
      })
   })
});