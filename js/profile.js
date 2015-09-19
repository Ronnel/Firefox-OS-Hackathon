$(document).ready(function(){
  $("input").focus(function(){
      $(".footer").fadeOut(0);
  });
  $("input").blur(function(){
      $(".footer").fadeIn(0);
  });
});
