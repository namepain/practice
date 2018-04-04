var ppt = {
  $wrapper: $('.wrapper'),
  $item: $('.ppt-item'),
  len: $('.ppt-item').length,
  nowIndex: 0,
  lock: true,
  timer: undefined,

  init: function () {
    console.time('aaa');
    if(this.len > 1) {
      this.createDom(this.len);
      this.bindEvent();
      this.autoPlay();
    }
  },
  bindEvent: function(){
    this.$wrapper
      .on('click', '.arrow > span, .dots li', this.changeIndex.bind(this));
  },
  createDom: function(len){
    var str = '';
    for(var i = 0; i < len; i++){
      if(i === 0 ){
        str += '<li class="active"></li>';
      } else {
        str += '<li></li>';
      }
    }
    str = '<div class="arrow">\
            <span class="left-arrow"></span>\
            <span class="right-arrow"></span>\
          </div>\
          <div class="dots">\
            <ul>'
            + str +
            '<ul>\
          </div>';
    this.$wrapper.append(str);
  },
  changeIndex: function(e){
    var $tar = $(e.target);
    if($tar.hasClass('left-arrow')){
      this.goIndex(this.nowIndex == 0 ? this.len - 1 : this.nowIndex - 1 );
    } else if($tar.hasClass('right-arrow')) {
      this.goIndex(this.nowIndex == this.len - 1 ? 0 : this.nowIndex + 1 );
    } else {
      this.goIndex($tar.index());
    }
  },
  goIndex: function(index){
    if(index === this.nowIndex)
      return this.autoPlay();
    if(this.lock){
      console.log(index);
      var that = this;
      var lastIndex = that.nowIndex;
      that.lock = false;
      that.nowIndex = index;

      // ppt-item 变换
      that.$item
        .eq(lastIndex).fadeOut(300)
        .find('p').delay(300).animate({fontSize: '16px'})
        .end()
        .find('.img').delay(300).animate({width: '0%'});
      that.$item
        .eq(index).delay(300).fadeIn(300, function(){
          that.lock = true;
          that.autoPlay();
        })
        .find('p').delay(300).animate({fontSize: '20px'})
        .end()
        .find('.img').delay(300).animate({width: '40%'});

      // 圆点变换
      $('.dots li')
        .eq(lastIndex).removeClass('active')
        .end()
        .eq(index).addClass('active');
    }
  },
  autoPlay: function(){
    var that = this;
    clearTimeout(that.timer);
    that.timer = setTimeout(function(){
      that.goIndex(that.nowIndex == that.len - 1 ? 0 : that.nowIndex + 1);
      console.timeEnd('aaa');
      console.time('aaa');
    }, 2000);
  }
}

ppt.init();