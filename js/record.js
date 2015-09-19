window.spring={};

window.onload = function(){
    //elementSpringTo('#speek-button', window.innerWidth/2 - 30,  20, [120, 10, 3], 0 , 0, 0);
    var photo = document.getElementById("speek-button");
    photo.addEventListener(downEvt, function() {
        spring.setEndValue(-1);
    });

    document.body.addEventListener(upEvt, function() {
        spring.setEndValue(0);
    });

    onRecordStart();
}

window.scale = function scale(el, val) {
  el.style.mozTransform =
  el.style.msTransform =
  el.style.webkitTransform =
  el.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
}


function onRecordStart(){
    var springSystem = new rebound.SpringSystem();
    spring = createSpring(springSystem, 40, 3);
    var springConfig = spring.getSpringConfig();
    spring.addListener({
        el: document.getElementById("speek-button"),
        onSpringUpdate: function(spring) {
            var val = spring.getCurrentValue();
            val = mapValueFromRangeToRange(val, 0, -1, 1, 0.5);
            scale(this.el, val);
          }
      });
}
