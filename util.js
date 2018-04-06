// 防抖
function debounce(fn, wait, immediate){
  var timer = null, result = null,
    debounced = function(){
      clearTimeout(timer);
      var _this = this,
        args = arguments;
      if(immediate){
        if(!timer) result = fn.apply(_this, args);
        timer = setTimeout(function(){
          timer = null;
        }, wait);
        return result;
      } else {
        timer = setTimeout(function(){
          fn.apply(_this, args);
        }, wait);
      }
    };
  debounced.cancel = function(){
    clearTimeout(timer);
    timer = null;
  }
  return debounced;
}

// 节流(时间戳版, 第一次会执行, 有头无尾)
function throttle(fn, wait){
  var lastTime = 0;
  return function(){
    var now = +new Date();
    if(now - lastTime > wait){
      fn.apply(this, arguments);
      lastTime = now;
    }
  }
}
// 节流（计时器版, 最后一次触发后过时间间隔会执行, 无头有尾）
function throttle(fn, wait){
  var timer;
  return function(){
    var _this = this,
      args = arguments;
    if(!timer){
      timer = setTimeout(function(){
        timer = null;
        fn.apply(_this, args);
      }, wait);
    }
  }
}
// underscore 节流
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};