$(document).ready(function() {
  var $tagsWrapper = $('.tags-wrapper');
  var $tagsUl = $tagsWrapper.find('.tags');
  var $tags = $tagsUl.find('.tag');
  var hash = window.location.hash;
  
  if(hash.length>0){
    hash = decodeURIComponent(window.location.hash.substring(1));
    $('#tag_'+hash).removeClass('d-none');
    $('.tag[data-id='+hash+']').addClass('focus');
    if(hash=='showAll'){
      $('.js-tags,.js-byDateTags').removeClass('d-none');
      $('.js-tags').addClass('d-none');
      $('.tags-wrapper .show-all').addClass('focus');
    }
    $tags.each(function(i){
      $(this).click(function(){
        $tags.removeClass('focus');
        $(this).addClass('focus');
        if(decodeURIComponent($(this).data().id)=='showAll'){
          $('.js-tags,.js-byDateTags').removeClass('d-none');
          $('.js-tags').addClass('d-none');
        }else{
          $('.js-tags,.js-byDateTags').addClass('d-none');
          $('#tag_'+decodeURIComponent($(this).data().id)).removeClass('d-none');
        }
      });
    });
  }else {
    location.href='#showAll';
    location.reload();
  }
})