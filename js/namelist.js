window.onload=function(){
    Parse.initialize("X4yCp0K91ZN0qD93vNENXrmmfeG8uvzmQjH7WIfT", "OsdEaOfeGHyYXUFPIpLYMgjwVgyTngYJawG3bcva");

    if(!$.jStorage.get("password") || !$.jStorage.get("email")){
        window.location = "./api_auth.html";
    }
    else{
        Parse.User.logIn( $.jStorage.get("email"), $.jStorage.get("password") , {
            success: function(user) {
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

function completion(text){
	var query = new Parse.Query(Parse.User);
	query.startsWith("name_lowercase", text.toLowerCase());
	query.find({
		success: function(people) {
			   console.log(people);
			   document.getElementById("scrollableMenu").innerHTML = "";
			   for(var i=0; i<people.length; ++i){
                   var p = new Person(people[i].id, people[i].attributes.name, people[i].attributes.profile_picture);

				   document.getElementById("scrollableMenu").appendChild(p.div);
			   }

               $('#scrollableMenu .person').click(function(){
                    addFriend($(this).find(".person").attr("data-person"));
               });
		}
	});
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
