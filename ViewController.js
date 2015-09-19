var parentClass = new View({
  		frame : {top: 10, left: 10, height: 30, width: 100},
  		styles: {
        	backgroundColor : "#000",
        	color: "white",
      	},
  		oncreate: function(){
          	alert('All you singe ladies!');
  		},
  		onclick: function(x, y){
		}
});


var testViewController = new ViewController();
testViewController.viewDidLoad = function(self){
      var newView = new View();
      
      newView.inheritFrom(parentClass);
      
      newView.text = "Hello world";
      
      self.view.addSubview(newView);
};
