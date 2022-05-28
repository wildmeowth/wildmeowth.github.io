$(document).ready(function() {
  $(".wild-drop .option").click(function() {
    var val = $(this).attr("data-value"),
        $drop = $(".wild-drop"),
        prevActive = $(".wild-drop .option.active").attr("data-value"),
        options = $(".wild-drop .option").length;
    if(val !== prevActive){
      location.href = val + '#showAll';
    }
    $drop.find(".option.active").addClass("mini-hack");
    $drop.toggleClass("visible");
    $drop.removeClass("withBG");
    $(this).css("top");
    $drop.toggleClass("opacity");
    $(".wild-hack").removeClass("mini-hack");
    if ($drop.hasClass("visible")) {
      setTimeout(function() {
        $drop.addClass("withBG");
      }, 400 + options*100); 
    }
    triggerAnimation();
    if (val !== "placeholder" || prevActive === "placeholder") {
      $(".wild-drop .option").removeClass("active");
      $(this).addClass("active");
    };
  });
  
  function triggerAnimation() {
    var finalWidth = $(".wild-drop").hasClass("visible") ? 5 : 5;
    $(".wild-drop").css("width", "6em");
    setTimeout(function() {
      $(".wild-drop").css("width", finalWidth + "em");
    }, 400);
  }
});