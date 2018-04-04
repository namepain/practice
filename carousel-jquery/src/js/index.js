var carousel = {
  $wrapper: $('.wrapper'),
  $carrousel: $('.carousel'),
  width:    $('.wrapper').width(),
  len:      $('.carousel li').length,
  nowIndex: 0,
  timer: undefined,
  lock: true,

  init: function(){
    this.bindEvent();
    this.autoPlay();
  }
  , bindEvent: function(){
    this.$wrapper
      .on('click', '.arrow a', this.slide.bind(this))
      .on('click', '.dots li', this.changeIndex.bind(this))
      .on('mouseenter', this.showArrow.bind(this))
      .on('mouseleave', this.hideArrow.bind(this))
  }
  , showArrow: function(){
    clearTimeout(this.timer);
    $('.arrow').show();
  }
  , hideArrow: function(){
    this.autoPlay();
    $('.arrow').hide();
  }
  , slide: function(e){
    var $curTar = $(e.currentTarget),
      i = this.nowIndex;
    if($curTar.hasClass('leftBtn')){
      this.goIndex('prev'); // ( i == 0 ? this.len - 2 : i - 1 );
    } else {
      this.goIndex('next'); // ( i == this.len - 1 ? 0 : i + 1 );
    }
  }
  , changeIndex: function(e){
    this.goIndex( $(e.target).index() );
  }
  , goIndex: function(index){
    if(!this.lock) return;
    var that = this,
      w = that.width,
      len = that.len
      now = that.nowIndex;
    that.lock = false;
    if(index == 'prev') {
      if(now == 0) {
        that.$carrousel.css({left: - (len - 1) * w + 'px'});
        index = len - 2;
      } else {
        index = now - 1;
      }
    } else if(index == 'next') {
      if(now == len - 1) {
        that.$carrousel.css({left: '0px'});
        index = 1;
      } else {
        index = now + 1;
      }
    }
    // 向目标图片移动
    that.$carrousel.animate({left: - index * this.width + 'px'}, function(){
      that.nowIndex = index;
      that.lock = true;
      that.autoPlay();
      console.log(index);
    });
    // 切换索引点
    $('.dots li')
      .eq(now > len - 2 ? 0 : now).removeClass('active')
      .end()
      .eq(index > len - 2 ? 0 : index).addClass('active');
  }
  , autoPlay: function(){
    var that = this;
    clearTimeout(this.timer);
    this.timer = setTimeout(function(){
      that.goIndex('next');
    }, 2000)
  }
}

carousel.init();