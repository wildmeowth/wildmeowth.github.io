$(document).ready(function() {

  $("table").wrap("<div class='table-responsive'></div>");
  $("table").addClass("table");
  
  $('.panel-cover .js-showFull').click(function(){
    if($('.panel-cover').hasClass('panel-cover--collapsed')){
      $('.panel-cover').animate({'height': '100%'}, 400, swing = 'swing', function() {} );
      $('.panel-cover').removeClass('panel-cover--collapsed');
      $('.panel-cover').css('z-index','9997');
      $('.panel-cover').css('position','fixed');
      $('.main-post-list').addClass('hidden');
    } else {
      collapsedPanel();
    }
  });
  $('a.subscribe-button').click(function(){
    $('.grey-div').removeClass('d-none');
    $('.subscribe-content').removeClass('d-none');
    console.log("微信搜索 吃鸡翅的程序猫");
  });
  $('.grey-div,.subscribe-content').click(function(){
    $('.grey-div').addClass('d-none');
    $('.subscribe-content').addClass('d-none');
  });
  $('a.blog-button').click(function() {
    if ($('.panel-cover').hasClass('panel-cover--collapsed')) return;
    $('.main-post-list').removeClass('hidden');

    collapsedPanel();
  });

  if (window.location.pathname.substring(0, 5) == "/tag/") {
    $('.panel-cover').addClass('panel-cover--collapsed');
  }
  
  if (window.location.pathname.substring(0, 7) == "/dates/") {
    $('.panel-cover').addClass('panel-cover--collapsed');
  }

  if (window.location.pathname.substring(0, 6) == "/tags/") {
    $('.panel-cover').addClass('panel-cover--collapsed');
  }

  if (window.location.pathname.substring(0, 12) == "/categories/") {
    $('.panel-cover').addClass('panel-cover--collapsed');
  }

  $('.btn-mobile-menu__icon').click(function() {
    if ($('.header-navigation').css('display') == "block") {
      $('.header-navigation').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('.header-navigation').toggleClass('visible animated bounceOutUp');
        $('.header-navigation').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
      });
      $('.header-navigation').toggleClass('animated bounceInDown animated bounceOutUp');

    } else {
      $('.header-navigation').toggleClass('visible animated bounceInDown');
    }
    $('.btn-mobile-menu__icon').toggleClass('fa fa-list fa fa-angle-up animated fadeIn');
  });

  $('.header-navigation .blog-button').click(function() {
    currentWidth = $('.panel-cover').width();
    if(currentWidth<991){
      if ($('.header-navigation').css('display') == "block") {
        $('.header-navigation').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          $('.header-navigation').toggleClass('visible animated bounceOutUp');
          $('.header-navigation').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        });
  
        $('.header-navigation').toggleClass('animated bounceInDown animated bounceOutUp');
      }
      
      $('.btn-mobile-menu__icon').toggleClass('fa fa-list fa fa-angle-up animated fadeIn');
    }
  });
  var collapsedPanel = function() {
    currentWidth = $('.panel-cover').width();
    var bgImage = $('.panel-cover').css('background-image');
    var adjustHeight = currentWidth < 991 ? currentWidth < 486 ? '229' : '242' : '40%';

    $('.panel-cover').removeAttr('style');
    $('.panel-cover').css('background-image', bgImage);
    $('.panel-cover').animate({'height': adjustHeight}, 400, swing = 'swing', function() {} );
    $('.panel-cover').addClass('panel-cover--collapsed');
    $('.main-post-list').removeClass('hidden');
  }

  var MQL = 1200;

  //primary navigation slide-in effect
  if ($(window).width() > MQL) {
      var headerHeight = $('.navbar-custom').height(),
          bannerHeight  = $('.post__header-header').height();     
      $(window).on('scroll', {
              previousTop: 0
          },
          function() {
              var currentTop = $(window).scrollTop(), 
                  $catalog = $('.side-catalog');

              //check if user is scrolling up by mouse or keyborad
              if (currentTop < this.previousTop) {
                  //if scrolling up...
                  if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                      $('.navbar-custom').addClass('is-visible');
                  } else {
                      $('.navbar-custom').removeClass('is-visible is-fixed');
                  }
              } else {
                  //if scrolling down...
                  $('.navbar-custom').removeClass('is-visible');
                  if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
              }
              this.previousTop = currentTop;


              //adjust the appearance of side-catalog
              $catalog.show()
              if (currentTop > (bannerHeight + 41)) {
                  $catalog.addClass('fixed')
              } else {
                  $catalog.removeClass('fixed')
              }
          });
  }
});
