$(document).ready(function(){
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



});

function submit(){
		var obj=[
			document.getElementById("name").value,
			document.getElementById("email").value,
      document.getElementById("phone").value,
      document.getElementById("school").value,
      document.getElementById("prfname").value,
      document.getElementById("status").value,
  ];
        if (!document.getElementById("name").value || !document.getElementById("email").value || !document.getElementById("phone").value || !document.getElementById("school").value || !document.getElementById("prfname").value || !document.getElementById("status").value) {
            alert("Fill All Input Fields And Try Again");
            return;
        }
        else {
          alert("Changes Have Been Saved");
          return;
        }
}

document.getElementById('profile-image-upload').onchange = function(e) {
    // Get the first file in the FileList object
    var imageFile = this.files[0];
    // get a local URL representation of the image blob
    var url = window.URL.createObjectURL(imageFile);
    // Now use your newly created URL!
    $("#prfpic").css("background", "url("+url+") center");
    $("#prfpic").css("background-size", "cover");
    $("#prfpic").css("-webkit-background-size", "cover");
    $("#prfpic").css("-moz-background-size", "cover");
    return;
}
