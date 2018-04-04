var total = 15,
  liWidth = ($('ul.wrapper').width() - 24) / 4,
  nowIndex,
  ratio = $(window).height() / $(window).width();

function render(){
  var str = '';
  for(var i = 0; i < total; i ++){
    str += '<li style="height:' + liWidth + 'px;">\
              <img src="./src/img/' + i + '.png" alt="">\
            </li>'
  }
  $(str).appendTo($('.wrapper')).animate({opacity: 1}, 500);
}

render();

$('ul').on('tap', 'li', function(){
  show($(this).index());
});

$('.show')
  .on('tap', function(){
    $(this).hide().empty();
  })
  .on('swipeLeft', function(){
    show(nowIndex >= total - 1 ? total - 1 : nowIndex + 1);
  })
  .on('swipeRight', function(){
    show(nowIndex <= 0 ? 0 : nowIndex - 1);
  });

function show(i){
  nowIndex = i;
  $('.show').empty().show();
  var oImg = new Image();
  oImg.src = './src/img/' + i + '.png';
  oImg.onload = function(){
    var h = this.height,
        w = this.width;

    if(h / w > ratio) {
      $(this).appendTo($('.show')).css('height', '100%').animate({opacity: 1}, 500);
    } else {
      $(this).appendTo($('.show')).css('width', '100%').animate({opacity: 1}, 500);
    }
  }
}