var selected= new Array();
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
    
    $("#sendButton").click(function(){
        pffile = new Parse.File("audio.ogg", { base64: $.jStorage.get("audio") });
        pffile.save().then(function() {
        console.log("Audio saved");
        var objs = Parse.Object.extend("TestObject");
        var audioObj = new objs();
       for(var i=0; i<selected.length;++i){
        audioObj.set("audioFile", pffile);
        audioObj.set("from", Parse.User.current().id);
        audioObj.set("to", selected[i]);
        audioObj.set("unread", true);
        audioObj.save().then(function() {
         // The file has been saved to Parse.
         console.log("Save successful");
        window.location = "./frontPage.html";
            }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
            });}
            
    }, function(error) {
    // The file either could not be read, or could not be saved to Parse.
          });
});

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
    $(".person").click(function(){
        if($(this).parent().attr("data-selected") === "false"){
        $(this).find(".addButton").fadeOut(100);
        $(this).css("background","#f5d76e");
        selected.push($(this).attr("data-person"));
            $(this).parent().attr("data-selected","true");}
        else {
            $(this).find(".addButton").fadeIn(100);
            $(this).css("background","#fff");
            selected=$.grep(selected,function(a){
                return a!== $(this).attr("data-person")
            });
            $(this).parent().attr("data-selected","false");
        }
        
    });
    
    
}


var Person = function(id, name, image){
  this.id=id;
  this.name=name;
  this.image=image;
  var div= document.createElement("div");
  div.setAttribute("class","person");
  div.setAttribute("data-selected","false");
  div.setAttribute("data-person",""+id);
  div.innerHTML="<div class='profile' style='background: url("+image+"); background-size: cover; -webkit-background-size: cover; -moz-background-size: cover;'></div><div class='name'>"+name+"</div><div class='addButton'></div>";
  this.div= div;
  return this;
}
