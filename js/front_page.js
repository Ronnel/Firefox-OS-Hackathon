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
    prepareRecord();

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




window.mediaRecorder = false;
var canvas = document.getElementById("visualiser");
// visualiser setup - create web audio api context and canvas

var audioCtx = new (window.AudioContext || webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");

window.timer = {};
window.currentTime = 0;


window.prepareRecord = function(){

    var photo = document.getElementById("speek-button");
    var springSystem = new rebound.SpringSystem();
    var spring = createSpring(springSystem, 40, 3);
    spring.addListener({
        el: photo,
        onSpringUpdate: function(spring) {
            var val = mapValueFromRangeToRange( spring.getCurrentValue() , 0, -1, 1, 2);
            scale(this.el, val);
        }
    });

    photo.addEventListener(downEvt, function() {
        spring.setEndValue(0);
        startRecord();
    });

    document.body.addEventListener(upEvt, function() {
        spring.setEndValue(-1);
        endRecord();
    });

    if (navigator.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.getUserMedia ({
            // constraints - only audio needed for this app
            audio: true,
            video: false
        },
        // Success callback
        function(stream) {
            visualize(stream);
            mediaRecorder = new MediaRecorder(stream);
        },

        // Error callback
        function(err) {
            console.log('The following getUserMedia error occured: ' + err);
        });
    } else {
        console.log('getUserMedia not supported on your browser!');
    }

}

function scale(el, val) {
    el.style.mozTransform =
    el.style.msTransform =
    el.style.webkitTransform =
    el.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
}

function startRecord(){
    $("#record-wrapper").fadeIn();
    timer = window.setInterval(function() {
        currentTime += 1;
        document.getElementById("current-time").innerHTML = currentTime;
        scale(document.getElementById("timer-inner"), currentTime/15);
        if(currentTime==15){
            endRecord();
        }
    }, 1000);
    if(mediaRecorder){
        mediaRecorder.start();
        console.log("recorder started");
    }
}

function endRecord(){
    window.clearInterval(timer);
    currentTime = 0;
    if(mediaRecorder){
        mediaRecorder.stop();
        console.log("recorder stopped");

        mediaRecorder.ondataavailable = function(e) {
            console.log("data available");
            var audio = document.createElement('audio');
            audio.style.display = "none";
            audio.setAttribute('controls', '');
            document.body.appendChild(audio);
            var audioURL = window.URL.createObjectURL(e.data);
            console.log(audioURL);
            audio.src = audioURL;
            //audio.play();
            var pffile = new Parse.File("myfile.zzz", e.data, "image/png");

            window.location = "sendlist.html";
        }
    }
}

function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  var WIDTH = canvas.width
  var HEIGHT = canvas.height;

  draw();

  function draw() {

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = '#3F404E';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(150, 150, 150)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;


    for(var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}



var fromHidden = -90;

// utility funciton to align 0 degrees with top
// takes degrees and returns degrees - 45
function topAlign(degrees) {
    return degrees - 45
};

// utility function to rotate a jQuery element
// takes element and the degree of rotation (from the top)
function rotate(el, degrees) {
	var degrees = topAlign(degrees || 0);
	el.css(
		'transform', 'rotate('+degrees+'deg)',
		'-webkit-transform', 'rotate('+degrees+'deg)',
		'-moz-transform', 'rotate('+degrees+'deg)',
		'-ms-transform', 'rotate('+degrees+'deg)',
		'-o-transform', 'rotate('+degrees+'deg)'
	)
}

// function to draw semi-circle
// takes a jQuery element and a value (between 0 and 1)
// element must contain four .arc_q elements
function circle(el, normalisedValue) {
	var degrees = normalisedValue * 360;             // turn normalised value into degrees
	var counter = 1;                                 // keeps track of which quarter we're working with
	el.find('.arc_q').each(function(){               // loop over quarters..
		var angle = Math.min(counter * 90, degrees); // limit angle to maximum allowed for this quarter
		rotate($(this), fromHidden + angle);         // rotate from the hiding place
		counter++; // track which quarter we'll be working with in next pass over loop
	});
	if (degrees > 90) {                              // hide the cover-up square soon as we can
		el.find('.arc_cover').css('display', 'none');
	}
}

// uses the the circle function to 'animate' drawing of the semi-circle
// incrementally increses the value passed by 0.01 up to the value required
function animate(el, normalisedValue, current) {
	var current = current || 0;
	circle(el, current);
	if (current < normalisedValue) {
		current += 0.01;
		setTimeout(function () { animate(el, normalisedValue, current); }, 1);
	}
}


navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
