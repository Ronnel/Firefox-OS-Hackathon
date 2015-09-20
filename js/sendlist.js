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

    $("#searchInput").on("keydown", function(){
        completion($(this).val());
    });
}

function layout(arr){
    // id, img, lastSeen, name_lowercase
    for(var i=0; i<arr.length; ++i){
        var person = new Person(arr[i].id, arr[i].name, arr[i].img);
        document.getElementById("scrollableMenu").appendChild(person.div);
    }

}


var Person = function(id, name, image){
  this.id=id;
  this.name=name;
  this.image=image;
  var div= document.createElement("div");
  div.setAttribute("class","person");
  div.innerHTML="<div class='profile' style='background: url("+image+"); background-size: cover; -webkit-background-size: cover; -moz-background-size: cover;'></div><div class='name'>"+name+"</div><div class='addButton'></div>";
  this.div= div;
  return this;
}
