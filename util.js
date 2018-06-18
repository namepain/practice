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

// 根据 （x, y）坐标得到左右上下方向
function getDirection(x ,y){
  // n 个象限，加 (n - 1) 后 % n, 转化为 整数标志。
  var d = (Math.round((Math.atan2(y,x) * (180/Math.PI) + 180)/90) + 3)%4;
  var direction;
  switch(d) {
      case 0:
          direction = 'top';
          break;
      case 1:
          direction = 'right';
          break;
      case 2:
          direction = 'bottom';
          break;
      case 3:
          direction = 'left';
  }
  return direction;
}




// 获取当前script 的 path 路径，document.currentScript 指向当前 script
function getPath() {
  var jsPath = document.currentScript ? document.currentScript.src : function(){
    var scripts = document.scripts,
        last = scripts.length - 1,
        src
    for(var i = last; i > 0; i--) {
      if (scripts[i].readyState === 'interactive') {
        src = scripts[i].src
        break;
      }
    }
    return src || scripts[last].src
  }()
  return jsPath.slice(0, jsPath.lastIndexOf('/') + 1)
}

// 异步加载 script
function loadScript(url, fn) {
  var node = document.createElement('script'),
      head = document.getElementsByTagName('head')[0]
  node.async = true
  node.charset = 'utf-8'
  node.src = url

  function onloadCb(e) {
    var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/
    if (e.type === 'load' || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
      head.removeChild(node)
      fn && fn()
    }
  }

  if (node.attachEvent) {
    node.attachEvent('onreadystatechange', onloadCb)
  } else {
    node.addEventListener('load', onloadCb)
  }

  head.appendChild(node)
}

// 异步加载 css
function loadCss(url) {
  var link = document.createElement('link'),
      head = document.getElementsByTagName('head')[0]
  link.rel = 'stylesheet'
  link.href = url
  link.media = 'all'

  head.appendChild(link);   // 主流浏览器并没有实现 link 的 load 事件，可以用特殊元素的样式轮询判断。
}

// ajax
function ajax(method, url, data, done, fail, async) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp')
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        done && done(xhr.responseText)
      } else {
        fail && fail()
      }
    }
  }
  method = method.toUpperCase()
  if (method === 'GET') {
    xhr.open(method, url + (data ? '?' + data : ''), async)
    xhr.send()
  } else if (method === 'POST'){
    xhr.open(method, url, async)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(data)
  }
}

// 将 ajax 再封装
function ajaxGet(url, data, done, fail) {
  var str = ''
  for (var i in data) {
    str += '&' + i + '=' + encodeURIComponent(data[i])
  }
  url = url.indexOf('?') > -1 ? url + str : url + '?' + str.slice(1)
  return ajax('GET', url, null, done, fail, true)
}

function ajaxPost(url, data, done, fail) {
  var str = ''
  for (var i in data) {
    str += '&' + i + '=' + encodeURIComponent(data[i])
  }
  return ajax('POST', url, str.slice(1), done, fail)
}

// 使用 promise 再封装
function get(url, data) {
  return new Promise(function(resolve, reject) {
    var str = ''
    for (var i in data) {
      str += '&' + i + '=' + encodeURIComponent(data[i])
    }
    url = url.indexOf('?') > -1 ? url + str : url + '?' + str.slice(1)
    return ajax('GET', url, null, resolve, reject, true)
  })
}



//圣杯继承
var inherit = (function (){
  var F = function () {};    
  return function (Child, Parent) {
      F.prototype = Parent.prototype;
      Child.prototype = new F();
      Child.prototype.constructor = Child;
      Child.prototype.uber = Parent.prototype;
  }
})();


// 类型判断
function classOf(o){
	if(o === null)  return "Null";
	if(o === undefined)  return "Undefined";
	return Object.prototype.toString.call(o).slice(8,-1);
}

// 操作cookie
var manageCookie = {
  setCookie: function(key, value, time){
      document.cookie = key + '=' + value + ';max-age=' + time;
      return this;
  },
  removeCookie: function(key){
      return this.setCookie(key, '', -1);
  },
  getCookie: function(key){
      var arr = document.cookie.split('; ');
      for (var i = 0; i < arr.length; i++) {
          var itemArr = arr[i].split('=');
          if(itemArr[0] == key){
              callback && callback(itemArr[1]);
              return this;
          }
      }
      callback && callback(undefined);
      return this;
  }
}



// 查看滚动轮滚动距离
function getScrollOffset(){
	if(window.pageXOffset){
		return {
			x: window.pageXOffset,
			y: window.pageYOffset
		}
	}else{
		return {
			x: document.body.scrollLeft + document.documentElement.scrollLeft,
			y: document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}
// 查看浏览器视口尺寸
function getViewportOffset(){
	if(window.innerWidth){
		return {
			w: window.innerWidth,
			h: window.innerHeight
		}
	}else if(document.compatMode === "CSS1Compat"){
		return{
			w: document.documentElement.clientWidth,
			h: document.documentElement.clientHeight
		}
	}else{
		return{
			w: document.body.clientWidth,
			h: document.body.clientHeight
		}
	}
}
// 求元素相对于文档的坐标
Element.prototype.getCoord = function (){
	var coordX = 0,
		coordY = 0,
		docEle = this;
	while(docEle){
		coordX += docEle.offsetLeft;
		coordY += docEle.offsetTop;
		docEle = docEle.offsetParent;
	}
	return {
		x: coordX,
		y: coordY
	}
};

// 查看元素样式
function getStyle(obj, prop){
  return window.getComputedStyle ? window.getComputedStyle(obj, null)[prop] : obj.currentStyle[prop];
}

// 添加事件的兼容性写法
function addEvent(elem, type, handler) {
  if (elem.addEventListener) {
      elem.addEventListener(type, handler, false);
  } else if(elem.attachEvent) {
      elem.attachEvent("on" + type, function(){
          handler.call(elem);
      });
  } else {
      elem['on' + type] = handler
  }
}

// 解除事件
function removeEvent(elem, type, handler){
	if(elem.removeEventListener){
		elem.removeEventListener(type, handler, false);
	}else if(elem.detachEvent){
		elem.detachEvent('on' + type, elem['temp' + type]);
	}else{
		elem['on' + type] = null;
	}
}
// 取消冒泡
function stopBubble(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
}
// 阻止默认事件
function cancelHandler(event){
	if(event.preventDefault){
		event.preventDefault();
	}else{
		event.returnValue = false;
	}
}
// 拖拽元素
function drag(elem){
    var disX;
    var disY;
    addEvent(elem,"mousedown",function(e){
        var event = e || window.event;
        disX = event.clientX - parseInt(getStyle(this,"left"));
        disY = event.clientY - parseInt(getStyle(this,"top"));
        addEvent(document,"mousemove",mouseMove);
        addEvent(document,"mouseup",mouseUp);
    });
    function mouseMove(e){
        var event = e || window.event;
        elem.style.left = event.pageX - disX + 'px';
        elem.style.top = event.pageY - disY + 'px';
    }
    function mouseUp(){
        removeEvent(document,"mousemove",mouseMove);
        removeEvent(document,"mouseup",mouseUp);
    }
}


// 兼容getElementByClassName
Document.prototype.getByClassName = function(target) {
  var allEle = document.getElementsByTagName('*'),
      len = allEle.length,
      arr = [],
      classArr = [],
      classArrLen;
  for(var i = 0; i < len; i++) {
      classArr = allEle[i].className.myTrim().splice(' ');
      classArrLen = classArr.length;
      for(var j = 0; j < classArrLen; j++){
          if(classArr[j] === target){
              arr.push(allEle[i]);
              break;
          }
      }
  }
  return arr;
}
// 兼容trim
String.prototype.myTrim = function() {
  var reg = /^\s*|\s*$/;
  return this.replace(reg,'');
}


// 在某元素后插入元素
Element.prototype.insertAfter = function (targetNode, afterNode){
	var siblingNode = afterNode.nextElementSibling;
	if(siblingNode) {
		this.insertBefore(targetNode,siblingNode);
	} else {
		this.appendChild(targetNode);
	}
	return targetNode;
}
// 销毁元素节点自身
Element.prototype.remove = function (){
	this.parentElement.removeChild(this);
}
// 目标节点内部的节点顺序逆序
Element.prototype.revChild = function (){
	var child = this.children,
		len = child.length;
	for (var i = len - 2; i >= 0; i--){
		this.appendChild(child[i]);
	}
	return this;
}

// 父节点的第几个元素节点
Element.prototype.eleIndex = function(){
	var index = 0,
		node = this;
	while(node = node.previousSibling){
		if(node.nodeType == 1){
			index++;
		}
	}
	return index;
}
// 第n层祖先元素
Element.prototype.nthParentEle = function(n) {
	var node = this,
		n = n || 0;
	while(node && n--) {
		node = node.parentElement;
	}
	return node;
}
// 第n个兄弟节点
Element.prototype.nthSiblingEle = function(n){
	var node = this;
	while(node && n) {
		if(n > 0){
			if(node.nextElementSibling){
				node = node.nextElementSibling;
			}else{
				for(node = node.nextSibling; node && node.nodeType !== 1; node = node.nextSibling);
			}
			n--;
		}else{
			if(node.previousElementSibling){
				node = node.previousElementSibling;
			}else{
				for(node = node.previousSibling; node && node.nodeType !== 1; node = node.previousSibling);
			}
			n++;
		}
	}
	return node;
}
