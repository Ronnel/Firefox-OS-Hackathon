var tutorial_enabled = false;
var current = 1;

function toggle(){
	if(current>0){
		$(".form1").fadeOut(0, function(){
			$(".form2").fadeIn(0);
		});
		$("#send_form").html("Sign Up");
	}
	else{
		$(".form2").fadeOut(0, function(){
			$(".form1").fadeIn(0);
		});
		$("#send_form").html("Log In");
	}
	current = -1 * current;
}


function submit(){
	if(current>0){
		Parse.User.logIn($("#form1_email").val(), $("#form1_password").val(), {
			success: function(user) {
						 //calliOSFunction("authenticated", [$("#form1_email").val(), $("#form1_password").val()]);
						 $.jStorage.set("email", $("#form1_email").val());
						 $.jStorage.set("password", $("#form1_password").val());

						 window.location = "./frontPage.html";
			},
			error: function(user, error) {
				// The login failed. Check error to see why.
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}
	else{
		var user = new Parse.User();
		user.set("username", $("#form2_email").val());
		user.set("password", $("#form2_password").val());
		user.set("email", $("#form2_email").val());
		user.set("name", $("#form2_name").val());
		user.set("profile_picture", "1");
		user.set("name_lowercase", $("#form2_name").val().toLowerCase());
		var arr = [];
		user.set("friends", arr);

		user.signUp(null, {
			  success: function(user) {
					// Hooray! Let them use the app now.
					alert("Signed Up!");
			  },
			  error: function(user, error) {
					// Show the error message somewhere and let the user try again.
					alert("Error: " + error.code + " " + error.message);
			  }
		});
	}
}


$(document).ready(function() {
		Parse.initialize("X4yCp0K91ZN0qD93vNENXrmmfeG8uvzmQjH7WIfT", "OsdEaOfeGHyYXUFPIpLYMgjwVgyTngYJawG3bcva");
		$("#form1_email").focus();

		$("#toggle").click(toggle);
		$("#send_form").click(submit);

});



function completion(text){
	var query = new Parse.Query(Parse.User);
	query.startsWith("name_lowercase", text.toLowerCase());
	query.find({
		success: function(people) {
			   console.log(people);
			   document.getElementById("autocomplete").innerHTML = "";
			   for(var i=0; i<people.length; ++i){
			       var name = people[i].attributes.name;
				   
				   img_string = '<div class="person" data-addable="true" data-person="'+people[i].id+'">' people[i].attributes.profile_picture +".png' />" +'</div>';

				   document.getElementById("autocomplete").innerHTML += '<div class="third '+people[i].id+'" id="'+people[i].id+'">'+img_string+'<div class="name">'+name+'</div><div class="lastActive">'+people[i].attributes.email+'</div></div>';
			   }

               $('#autocomplete .third').click(function(){
                    addFriend($(this).find(".person").attr("data-person"));
               });
		}
	});
}

var current_search = 1;
function toggle_search(){
	if(current_search>0){
		$("#title").fadeOut(100, function(){
			$("#search").fadeIn(function(){
			    $("#search").focus();
			    $("#search").select();
			});
		});
		$("#autocomplete").fadeIn();
		$(".action").addClass("close");
	}
	else{
		$("#search").fadeOut(100, function(){
			$("#title").fadeIn();
		});
		$("#autocomplete").fadeOut();
		$(".action").removeClass("close");
	}
	current_search *= -1;
}

function settings(){
        Android.openNewPage("settings.html", {});
}

var friends;

function getFriends(func){
		Parse.initialize("X4yCp0K91ZN0qD93vNENXrmmfeG8uvzmQjH7WIfT", "OsdEaOfeGHyYXUFPIpLYMgjwVgyTngYJawG3bcva");
        Parse.Cloud.run('getFriends', {}, {
            success: function(people){
				func(people);
            },
            error: function(error){
                console.log(error);
            }
        });

}

var colors = ["#3498db", "#f39c12", "#2ecc71", "#9b59b6", "#e74c3c", "#7f8c8d"];
var timeoutId = 0;

function addFriend(id){
				   var friends = Parse.User.current().attributes.friends;
					friends.push(id);
					console.log(friends);
					$("#autocomplete").fadeOut();
					var currentUser = Parse.User.current();
					currentUser.set('friends',friends);
					currentUser.save(null,{
									 success: function(gameScore) {
									    // Execute any logic that should take place after the object is saved.
									    getFriends();
									    layout();
									    toggle_search();
									    $("#autocomplete").html("");
									    if(tutorial_enabled){
									        tutorial_enabled = false;
									        alert("Swipe right on a contact to read message");
									    }
						             },
									 error: function(gameScore, error) {
									    // Execute any logic that should take place if the save fails.
									    // error is a Parse.Error with an error code and message.
									    alert('Failed to add friend, with error code: ' + error.message);
									    getFriends();
									    toggle_search();
									 }
					});
}

function layout(){
	var i=0;
	$(".name").css("width", (window.innerWidth - 160)+"px");
	$("#scroller .third").each(function(){
		$(this).find(".colorable").css("background", colors[i%colors.length]);

		$(this).click(function(){

			if($(this).find('.options').length==0){
				$('.options').remove();
				var current = $(this);
                $(this).append("<div class='options'></div>");
                $(this).find('.options').append("<img src='assets/trash.png' id='delete_option' />");
                $("#delete_option").click(function(){
                    remove(current);
                });
                $(this).find('.options').append("<img src='assets/play.png' id='play_option' />");
                $("#play_option").click(function(){
                    play(current);
                });
                $(this).find('.options').transition({
					"height" : "60px"
				}, 200);
			}
			else if($(this).find('.options').length==1){
			    $(this).find('.options').transition({
					"height" : "0px"
				}, 200, function(){ $(this).remove(); });
			}
		});
		i++;
	});

	var touchstartevent = window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart";
	var touchmoveevent = window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";
	var touchendevent = window.navigator.msPointerEnabled ? "MSPointerUp" : "touchend";

    var touchstart, touchdist;

	$('.third').bind(touchstartevent, function(e) {
		touchstart = window.navigator.msPointerEnabled ? e.originalEvent.layerX : e.originalEvent.targetTouches[0].pageX;
		$(this).addClass("touchstarted");
		touchdist = 0;
	});


	$('.third').bind(touchmoveevent, function(e) {
		if ($(this).hasClass("touchstarted")) {
			var touchmove = window.navigator.msPointerEnabled ? e.originalEvent.layerX : e.originalEvent.targetTouches[0].pageX;

			touchdist = touchmove - touchstart - 10;
			if (touchdist < -20) {
			    e.preventDefault();
				$(this).css("-webkit-transform", "translate3d(" + touchdist + "px, 0, 0)");
				$(this).css("transform", "translate3d(" + touchdist + "px, 0, 0)");
				$("#red").css("display", "block").css("top", ($(this).offset().top) + "px").css("width", (-1 * touchdist) + "px");
			}
		}

	});


	$('.third').bind(touchendevent, function(e) {
		if ($(this).hasClass("touchstarted")) {
		    $(this).transition({
					"-webkit-transform": "translate3d(0, 0, 0)",
					"transform": "translate3d(0, 0, 0)"
				}, 200);
			var current = $(this);
			if (touchdist < -70) {
				$(this).transition({
					"-webkit-transform": "translate3d(0, 0, 0)",
					"transform": "translate3d(0, 0, 0)"
				}, 200);
				$("#red").transition({
					width: "0px"
				}, 200, function() {
					$("#red").fadeOut();
                    play(current);
				});
			} else {
				$("#red").transition({
					width: "0px"
				}, 200);
			}
		}
	});

}


function remove(person){
        var friends = Parse.User.current().attributes.friends;
        var index = friends.indexOf(person.find('.person').attr("data-person"));
        friends.splice(index, 1);

        Parse.User.current().set("friends", friends);

        Parse.User.current().save(null, {
            success: function(){ getFriends(); },
            error: function(){ alert('Delete unsuccessful'); }
        });
}

function sendTo(person){
        var obj = {
                from: Parse.User.current().id,
                to: $(person).find('.person').attr("data-person"),
                to_name: person.find('.name').html()
        };
		Android.openNewPage("record.html", JSON.stringify(obj));
}

function play(person){
					var GameScore = Parse.Object.extend("TestObject");
			        var query = new Parse.Query(GameScore);
			        query.equalTo("from", person.find('.person').attr("data-person")).equalTo("unread", true).equalTo("to", Parse.User.current().id).descending("createdAt").first({
				        success: function(gameScore) {
				            if(gameScore){
					            Android.playRecord(gameScore.attributes.audioFile._url);
					            gameScore.set("unread", false);
					            gameScore.save(null, {
                                    success: function(){ getFriends(); },
                                    error: function(){  }
                                });
					        }
					        else{
					            var GameScore2 = Parse.Object.extend("TestObject");
			                    var query2 = new Parse.Query(GameScore2);
			                    query2.equalTo("from", person.find('.person').attr("data-person")).equalTo("to", Parse.User.current().id).descending("createdAt").first({
                                    success: function(gameScore2) {
                                        if(gameScore2){
                                            Android.playRecord(gameScore2.attributes.audioFile._url);
                                        }
                                        else{
					                        alert("No new messages");
					                    }
					                },
                                    error: function(object, error) {
                                        // The object was not retrieved successfully.
                                        // error is a Parse.Error with an error code and message.
                                    }
					            });
					        }
				        },
				        error: function(object, error) {
					        // The object was not retrieved successfully.
					        // error is a Parse.Error with an error code and message.
				        }
			        });
}
