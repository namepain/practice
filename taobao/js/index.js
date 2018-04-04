// 左侧导航 hover 切换
$('.left > ul').on('mouseenter', 'li', function(){
    $('.li-panel-wrapper .li-panel').eq($(this).index()).addClass('on');
  }).on('mouseleave', 'li', function(){
    $('.li-panel-wrapper .li-panel.on').removeClass('on');
  }
)



// $('.carousel').each(function(){

  // autoplay(this, 'add');

  // var that = this,
  //  step = $(this).width(),
  //  num = $(this).find('.carousel-item').length;

  // this.timer = setInterval(function(){

  //   var index = $(that).data('carousel-index') || 1;
    
  //   if(index == num){
  //     index = 1;
  //     $(that).find('.carousel-box').css({left: '0px'});
  //   }
  //   var s = - index * step;
  //   console.log('index---> ' + index + ', 距离----> ' + s);
  //   $(that).find('.carousel-box').animate({left: s + 'px'});
  //   index++;
  //   $(that).data('carousel-index', index);
  // }, 2000);
// });


    // function autoplay(div, direction){
    //   div.carouselTimer = setTimeout(function(){
    //     slide(div, direction);
    //   }, 2000);
    // }
  
    // function slide(div, direction){
    //   var index = $(div).data('carousel-index') || 1;
    //   var step = $(div).width();
    //   var num = $(div).find('.carousel-item').length;
    //   var box = $(div).find('.carousel-box');
    //   var lock = $(div).data('carousel-lock');
  
    //   if(lock) return;

    //   console.timeEnd();

    //   clearTimeout(div.carouselTimer);
    //   $(div).data('carousel-lock', true);
  
    //   if(direction == 'sub') {
    //     if(index == 1){
    //       index = num;
    //       box.css({left: - (num - 1) * step + 'px'});
    //     }
    //     var s = - (index - 2) * step;
    //     box.animate({left: s + 'px'}, function(){

    //       console.time();
          
    //       $(div).data('carousel-lock', false);
    //       div.carouselTimer = setTimeout(function(){
    //         slide(div);
    //       }, 2000);
    //     });
    //     index--;
    //     $(div).data('carousel-index', index);
        
    //     console.log('index--->' + index + '__ 距离---->' + s);
  
    //   } else {  // 'add'
    //     if(index == num){
    //       index = 1;      // 到最右边一张时 index 重置
    //       box.css({left: '0px'});
    //     }
    //     var s = - index * step;
    //     box.animate({left: s + 'px'}, function(){
          
    //       console.time();
          
    //       $(div).data('carousel-lock', false);
    //       div.carouselTimer = setTimeout(function(){
    //         slide(div, 'add');
    //       }, 2000);
    //     });
    //     index++;
    //     $(div).data('carousel-index', index);
        
    //     console.log('index--->' + index + '__ 距离---->' + s);
    //   }
    // }

  HTMLDivElement.prototype.Carousel = (function(){
    function Class(ops){
      this.conf = {
        elem: ops.elem,
        width: ops.width || '600px'
        ,height: ops.height || '280px'
        ,arrow: ops.arrow || 'hover' //切换箭头默认显示状态：hover/always/none
        ,autoplay: ops.autoplay !== undefined ? ops.autoplay : true //是否自动切换
        ,interval: 3000 //自动切换的时间间隔，不能低于800ms
        ,trigger: 'click' //指示器的触发方式：click/hover
        // ,index: 0 //初始开始的索引
        // ,full: ops.full || false //是否全屏
        // ,indicator: 'inside' //指示器位置：inside/outside/none
        // ,anim: '' //动画类型：default/updown/fade
      };
      this.render();
    }

    Class.prototype.render = function(){
      // 参数修正
      var that = this,
        conf = that.conf,
        elem = conf.elem,
        box = elem.getElementsByClassName('carousel-box')[0];
        elemItem = elem.getElementsByClassName('carousel-item');
        that.box = box;
        that.elemItem = elemItem;

      if(elemItem.length < 2) return;
      // if(conf.index < 0) conf.index = 0;
      // if(conf.index > elemItem.length) conf.index = elemItem.length - 1;
      if(conf.interval < 800) conf.interval = 800;

      elem.style.width = conf.width;
      elem.style.height = conf.height;

      // 初始化 剪头、指示器
      that.indicator();
      that.arrow();

      // 开始滑动、定义事件
      that.autoplay();
      that.events();
    }

    Class.prototype.autoplay = function(){
      var that = this;
      if(!that.conf.autoplay) return;
      that.timer = setTimeout(function(){
        that.slide();
      }, that.conf.interval);
    }
    Class.prototype.getPrevIndex = function(){}
    Class.prototype.getNextIndex = function(){}
    Class.prototype.subIndex = function(){}
    Class.prototype.addIndex = function(){}
    Class.prototype.arrow = function(){}
    Class.prototype.indicator = function(){}
    Class.prototype.slide = function(num, type){
      var that = this,
        box = that.box,                       // 移动的盒子
        elemItem = that.elemItem,             // 盒子里的 li
        maxIndex = elemItem.length - 1,       // 最大索引
        step = parseInt(getStyle(elemItem[0], 'width')),  // 步进距离
        index = that.index || 0,              // 当前展示的图片索引
        type = type || that.conf.type,        // 轮播方向
        lock = that.lock,                     // 锁
        endPoint;
      
      if(lock) return;

      console.timeEnd();
      console.time();

      that.lock = true;                       // 开始滑动就上锁
      clearTimeout(that.timer);               // 清除 timer 以免点击触发和定时触发重复
      
      if(typeof num === 'number'){            // 点击下方指示器直接滑到目的地
        if(index === maxIndex) 
          box.style.left = '0px';
        index = num;
      }else if(type == 'toRight'){            // 图片向右滑
        if(index == 0){                       // 图片到最左一张了
          index = maxIndex;
          box.style.left = - index * step + 'px';
        }
        index --;
      } else {                                // 默认向左滑
        if(index == maxIndex){
          index = 0;
          box.style.left = '0px';
        }
        index ++;
      }

      that.index = index;
      endPoint = - index * step;
      startMove(box, {left: endPoint}, function(){
        that.lock = false;
        that.autoplay();
      });
      console.log('index--->' + index + '__ 现位置---->' + endPoint);
    }
    Class.prototype.events = function(){}
    

    function startMove(obj, json, call){
      clearInterval(obj.startMove_timer);
      var speedObj = {};
      obj.startMove_timer = setInterval(function(){
        var canStop = true,
          cur, speed;
        for(var prop in json){
          if(prop == 'opacity'){
            cur = parseFloat(getStyle( obj, prop )) * 100;
          } else {
            cur = parseInt(getStyle( obj, prop ));
          }

          if(speedObj[prop]){
            speed = speedObj[prop];
          } else {
            speed = (speedObj[prop] = (json[prop] - cur) / 7);
          }
          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

          if(prop == 'opacity'){
            if(Math.abs(( cur + speed) / 100) > Math.abs(json[prop]) ) {
              obj.style.opacity = json[prop] / 100;
            } else {
              obj.style.opacity = (cur + speed) / 100;
            }
          } else {
            if(Math.abs(json[prop] - cur) < Math.abs(speed)){
              obj.style[prop] = json[prop] + 'px';
            } else {
              obj.style[prop] = cur + speed + 'px';
            }
          }
          if(parseInt(obj.style[prop]) != json[prop]){
            canStop = false;
          }
        }
        if(canStop){
          clearInterval(obj.startMove_timer);
          typeof call === 'function' && call();
        }
      }, 30);
    }

    function getStyle(obj, prop){
      return window.getComputedStyle ? window.getComputedStyle(obj, null)[prop] : obj.currentStyle(prop);
    }

    return function(ops){
      ops = ops || {};
      ops.elem = this;
      return (this.carouselInstance = new Class(ops));
    };
  }());


  var oDiv = document.getElementsByClassName('carousel')[0];
  oDiv.Carousel({
    width: '520px',
    height: '280px'
  });
  // div.Carousel();
  console.time();