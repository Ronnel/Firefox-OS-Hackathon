var contact = function(id, name, dp){
  this.id=id;
  this.name=name;
  this.dp=dp;
  var div= document.createElement("div");
  div.setAttribute("class", "contacts");
  div.innerHTML="<div class='profile_pic' style='background: url("+dp+"); background-size: cover; -webkit-background-size: cover; -moz-background-size: cover;'></div><div class='name'>"+name+"</div><div class='addButton'></div>";
  this.div=div;
  return this;
}


window.onload=function(){
    Parse.initialize("X4yCp0K91ZN0qD93vNENXrmmfeG8uvzmQjH7WIfT", "OsdEaOfeGHyYXUFPIpLYMgjwVgyTngYJawG3bcva");

    if(Parse.User.current()){
        getFriends(layout);
    }
    else if(!$.jStorage.get("password") || !$.jStorage.get("email")){
        window.location = "./api_auth.html";
    }
    else{
        Parse.User.logIn( $.jStorage.get("email"), $.jStorage.get("password") , {
            success: function(user) {
                getFriends(layout);
            },
            error: function(user, error) {
                // The login failed. Check error to see why.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
}


function layout(arr){
    // id, img, lastSeen, name_lowercase
    for(var i=0; i<arr.length; ++i){
        var person = new contact(arr[i].id, arr[i].name, arr[i].img);
        document.getElementById("scroller").appendChild(person.div);
    }

}
