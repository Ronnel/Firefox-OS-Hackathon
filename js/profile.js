$(document).ready(function(){
  $("input").focus(function(){
      $(".footer").fadeOut(0);
  });
  $("input").blur(function(){
      $(".footer").fadeIn(0);
  });

  $("#submit").click(submit);
});

function submit(){
		var obj=[
			document.getElementById("name").value,
			document.getElementById("email").value,
      document.getElementById("phone").value,
      document.getElementById("school").value,
      document.getElementById("prfname").value,
      document.getElementById("status").value,
		]
        if (!document.getElementById("name").value || !document.getElementById("email").value || !document.getElementById("phone").value || !document.getElementById("school").value || !document.getElementById("prfname").value || !document.getElementById("status").value) {
            alert("Fill All Input Fields And Try Again");
            return;
        }
        else {
          alert("Changes Have Been Saved");
          return;
        }
}
