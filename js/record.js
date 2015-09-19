

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
}

function endRecord(){
    window.clearInterval(timer);
    currentTime = 0;
}
