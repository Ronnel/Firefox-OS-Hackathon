function include(filename){
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', filename+".js?"+Math.floor(Math.random()*100));
		document.body.appendChild(script);
}

function log(obj){
		console.log(obj);
};

// PRAGMA MARK: classes prototypes

function View(constructor){
		var obj = constructor || {};
		this.views = [];
		this.frame = obj.frame||{};
		this.styles = obj.styles || {};

		this.div = document.createElement("div");
		this.oncreate = obj.oncreate || function(){};

		return this;
};


function ViewController(obj){
		this.self = this;
  		this.viewDidLoad = function(){};
		return this;
};

// PRAGMA MARK: classes implementation

View.prototype.inheritFrom = function(parentClass){
		this.styles = parentClass.styles || {};
		this.frame = parentClass.frame || {};
		this.text = parentClass.text || {};
		this.div = parentClass.div || {};
		this.views = parentClass.views || {};
		this.oncreate = parentClass.oncreate || function(){};
}

View.prototype.addSubview = function(newView){

		newView.div.innerHTML = newView.text || "";

		for(style in newView.styles){
				newView.div.style[style] = newView.styles[style];
		}

		newView.div.style.width = (newView.frame.width||0)+"px";
		newView.div.style.height = (newView.frame.height||0)+"px";
		newView.div.style.top = (newView.frame.top||0)+"px";
		newView.div.style.left = (newView.frame.left||0)+"px";
		newView.div.style.position = "absolute";

		this.views.push(newView);
		this.div.appendChild(newView.div);

		newView.oncreate();
};



window.mapValueFromRangeToRange = function(value, fromLow, fromHigh, toLow, toHigh) {
    fromRangeSize = fromHigh - fromLow;
    toRangeSize = toHigh - toLow;
    valueScale = (value - fromLow) / fromRangeSize;
    return toLow + (valueScale * toRangeSize);
}
window.createSpring = function createSpring(springSystem, friction, tension, rawValues) {
  var spring = springSystem.createSpring();
  var springConfig;
  if (rawValues) {
    springConfig = new rebound.SpringConfig(friction, tension);
  } else {
    springConfig = rebound.SpringConfig.fromOrigamiTensionAndFriction(friction, tension);
  }
  spring.setSpringConfig(springConfig);
  spring.setCurrentValue(0);
  return spring;
}

window.downEvt = window.ontouchstart !== undefined ? 'touchstart' : 'mousedown';
window.upEvt = window.ontouchend !== undefined ? 'touchend' : 'mouseup';
