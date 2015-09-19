window.mediaRecorder = false;
var canvas = document.getElementById("visualiser");
// visualiser setup - create web audio api context and canvas

var audioCtx = new (window.AudioContext || webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");

window.timer = {};
window.currentTime = 0;


window.onload = function(){

    var photo = document.getElementById("speek-button");
    var springSystem = new rebound.SpringSystem();
    var spring = createSpring(springSystem, 40, 3);
    spring.addListener({
        el: photo,
        onSpringUpdate: function(spring) {
            var val = mapValueFromRangeToRange( spring.getCurrentValue() , 0, -1, 1, 0.5);
            scale(this.el, val);
        }
    });

    photo.addEventListener(downEvt, function() {
        spring.setEndValue(-1);
        startRecord();
    });

    document.body.addEventListener(upEvt, function() {
        spring.setEndValue(0);
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

window.scale = function scale(el, val) {
    el.style.mozTransform =
    el.style.msTransform =
    el.style.webkitTransform =
    el.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
}

function startRecord(){
    timer = window.setInterval(function() {
        currentTime += 1;
        document.getElementById("current-time").innerHTML = currentTime;
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
            audio.src = audioURL;
            audio.play();
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


navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
