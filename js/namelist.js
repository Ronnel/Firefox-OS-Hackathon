window.onload= function(){

  var arr = new Array();
  arr[0]= new Person(1, "John", "dfesa");
  arr[1]= new Person(2, "Carl", "gjosd");
  arr[2]= new Person(3, "Emily", "dffds");

  for(var i=0;i<arr.length;++i){
  document.getElementById("scrollableMenu").appendChild(arr[i].div);
  }
}

var Person = function(id, name, image){
  this.id=id;
  this.name=name;
  this.image=image;
  var div= document.createElement("div");
  div.setAttribute("class","person");
  div.innerHTML="<div class='profile'></div><div class='name'>"+name+"</div><div class='addButton'></div>";
  this.div= div;
  return this;
}
