window.mediaRecorder = false;

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

window.timer = {};
window.currentTime = 0;
function startRecord(){
    timer = window.setInterval(function() {
        currentTime += 1;
        document.getElementById("current-time").innerHTML = currentTime;
    }, 1000);

    mediaRecorder.start();
    console.log(mediaRecorder.state);
    console.log("recorder started");
}

function endRecord(){
    window.clearInterval(timer);
    currentTime = 0;
    if(mediaRecorder){
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");

        mediaRecorder.ondataavailable = function(e) {
            console.log("data available");
            var audio = document.createElement('audio');
            audio.setAttribute('controls', '');
            document.body.appendChild(audio);
            var audioURL = window.URL.createObjectURL(e.data);
            audio.src = audioURL;
            audio.play();
        }
    }
}


navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
