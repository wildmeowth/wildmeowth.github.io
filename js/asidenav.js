var asideNav = $("#aside-nav")[0];
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var asideMenuWidth = $("#aside-nav .aside-menu").width();
var asideRight = parseInt($("#aside-nav").css('right'));
var asideBottom = parseInt($("#aside-nav").css('bottom'));
var asideBorderRadius = $("#aside-nav .aside-menu").css('border-radius');
var asideLimited =  60;
var asideLeft = w - asideMenuWidth;
$("#aside-nav").on("touchmove", function(e){
	e.preventDefault();
	if(e.originalEvent.targetTouches.length == 1){
        var touch = e.originalEvent.targetTouches[0];
        var currentAsideRight = w - touch.clientX - $("#aside-nav").width()/2;
        var currentAsideBottom = h - touch.clientY - $("#aside-nav").height()/2;
        $("#aside-nav").css({'right': currentAsideRight + 'px','bottom': currentAsideBottom + 'px'});
        // var right
        if(currentAsideRight > asideRight || currentAsideBottom > asideBottom) {
            $("#aside-nav .aside-menu").css('border-radius', asideMenuWidth);
            $("#aside-nav").addClass('full');
        }else{
            $("#aside-nav .aside-menu").css('border-radius', asideBorderRadius);
            $("#aside-nav").removeClass('full');
        }
        $("#aside-nav").css({'right': currentAsideRight < asideRight ? asideRight : currentAsideRight > asideLeft - asideLimited ? asideLeft : currentAsideRight + 'px','bottom': currentAsideBottom < asideBottom ? asideBottom : currentAsideBottom + 'px'});
        if(currentAsideBottom < asideLimited && currentAsideRight < asideLimited){
            $("#aside-nav").css({'right': asideRight + 'px','bottom': asideBottom + 'px'});
            $("#aside-nav .aside-menu").css('border-radius', asideBorderRadius);
            $("#aside-nav").removeClass('full');
        }
        if(currentAsideBottom < asideLimited && currentAsideRight > asideLeft - asideLimited){
            $("#aside-nav").css({'right': asideLeft + 'px','bottom': asideBottom + 'px'});
            $("#aside-nav .aside-menu").css('border-radius','0px ' + asideMenuWidth +  'px 0px 0px');
            $("#aside-nav").removeClass('full');
            $("#aside-nav").addClass('left');
        }else{
            $("#aside-nav").removeClass('left');
        }
	}
})
