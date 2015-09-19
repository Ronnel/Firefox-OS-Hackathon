var contact = function(id, name, dp){
  this.id=id;
  this.name:test;
  this.dp:dp;
  var div= document.createElement("div");
  div.setAttribute("class", "contacts");
  div.innerHTML="<div class='profile_pic' style='background: url("+dp+"); background-size: cover; -webkit-background-size: cover; -moz-background-size: cover;'></div><div class='name'>"+name+"</div><div class='addButton'></div>";
  this.div=div;
  return this;
}


window.onload=function(){
  
  
}