window.onload= function(){

  var arr = new Array();
  arr[0]= new Person(1, "John", "img/icons/Default_Profile_1.png");
  arr[1]= new Person(2, "Carl", "img/icons/Default_Profile_2.jpg");
  arr[2]= new Person(3, "Max", "img/icons/Max.jpg");

  for(var i=3;i<50;++i){
    arr[i]= new Person(i+1, "Gakuto", "img/icons/Gakuto_face.jpg");
  }

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
  div.innerHTML="<div class='profile' style='background: url("+image+"); background-size: cover; -webkit-background-size: cover; -moz-background-size: cover;'></div><div class='name'>"+name+"</div><div class='addButton'></div>";
  this.div= div;
  return this;
}
