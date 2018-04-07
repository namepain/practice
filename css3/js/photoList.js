setTimeout(function(){
  $('.wrapper').removeClass('init');
}, 100);

$('.item').click(function(){
  $(this).addClass('active');
  $('.wrapper').addClass('wrapper-active');
});

$('.close').click(function(e){
  e.stopPropagation();
  $('.active').removeClass('active');
  $('.wrapper').removeClass('wrapper-active');
});