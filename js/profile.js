$(document).ready(function(){
  Parse.initialize("X4yCp0K91ZN0qD93vNENXrmmfeG8uvzmQjH7WIfT", "OsdEaOfeGHyYXUFPIpLYMgjwVgyTngYJawG3bcva");

  $("#prfname").val(Parse.User.current().attributes.name);
  $("#status").val(Parse.User.current().attributes.status);
  $("#email").val(Parse.User.current().attributes.email);
  console.log(Parse.User.current());
  $("input").focus(function(){
      $(".footer").fadeOut(0);
  });
  $("input").blur(function(){
      $(".footer").fadeIn(0);
  });

  $("#submit").click(submit);

  $("#prfpic").css("background", "url(img/icons/Default_Profile_2.jpg) center");
  $("#prfpic").css("background-size", "cover");
  $("#prfpic").css("-webkit-background-size", "cover");
  $("#prfpic").css("-moz-background-size", "cover");

  $('#prfpic').click(function() {
    $('#profile-image-upload').click();
});

$('#lgout').click(function() {
  Parse.User.logOut();
  $.jStorage.deleteKey("email");
  $.jStorage.deleteKey("password");
  window.location="./api_auth.html";
});



});

function submit(){

		var name =	document.getElementById("prfname").value;
    var name_lowercase = name.toLowerCase();
		var email =	document.getElementById("email").value;
    var username = email;
    var status =  document.getElementById("status").value;
    var password =  document.getElementById("pass").value;

    var user = Parse.User.current();

    user.set("name", name);
    user.set("email", email);
    user.set("status", status);
    user.set("username", username);
    user.set("name_lowercase", name_lowercase);

    user.save().then(function(){
      alert("Successfully Saved");
    });



}
var parseFile;
document.getElementById('profile-image-upload').onchange = function(e) {
    // Get the first file in the FileList object
    var imageFile = this.files[0];
    // get a local URL representation of the image blob
    var url = window.URL.createObjectURL(imageFile);
    parseFile = new Parse.File("image.jpg", imageFile);

   //put this inside if {
   parseFile.save().then(function() {
      // The file has been saved to Parse.
      Parse.User.current().set("profile_pic", parseFile);
      Parse.User.save();
   }, function(error) {
   // The file either could not be read, or could not be saved to Parse.
    });

    // Now use your newly created URL!
    $("#prfpic").css("background", "url("+url+") center");
    $("#prfpic").css("background-size", "cover");
    $("#prfpic").css("-webkit-background-size", "cover");
    $("#prfpic").css("-moz-background-size", "cover");
    return;
}
