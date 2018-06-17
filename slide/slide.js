/**
 * 通过 div.slide() 调用生成轮播图
 */

HTMLDivElement.prototype.slide = (function(){

  var defaultOptions = {
    elem: '',           // 轮播的元素
    autoplay: true,     // 自动播放
    interval: 3000,     // 轮播周期
    trigger: 'click',   // 指示器切换方式 / mouseover
    direction: 'right', // 自动轮播方向
    loop: true,         // 一个方向魂环
    initialIndex: 0     // 初始展示的 index 项
  }

  function Class(ops) {
    this.options = extend({}, defaultOptions, ops)
    this.status = this.options.direction              // 用于标记取 nextIndex 时的状态
    this.oList = this.options.elem.getElementsByClassName('swpie-list')[0]
    this.step = this.oList.clientWidth
    
    var loop = this.options.loop,
        index = this.options.initialIndex,
        length = this.oList.childElementCount;

    if (length < 2) return
    if(loop) {
      this.cloneNode()
      this.curIndex = index + 1      // 当前 index
      this.length = length + 2
    } else {
      this.curIndex = index          // 当前 index
      this.length = length
    }

    this.toPosition(this.curIndex, true)
    this.changeIndex(index)
    this.initIndicator()
    this.initArrow()
    this.autoplay()
  }

  Class.prototype.autoplay = function() {
    if (!this.options.autoplay) return
    var _this = this

    _this.timer = setTimeout(function(){
      _this.slide()
    }, Math.max(this.options.interval, 800))
  }

  Class.prototype.toPosition = function(toIndex, noDuration) {
    var style = this.oList.style
    if (noDuration) {
      style.transitionDuration = "0s"
    }
    var target = toIndex * this.step
    style.transform = "translateX(-" + target + "px)";
    if (noDuration) {
      // this.oList.offsetWidth     // 强制 reflow，不然浏览器会将执行后面语句把 duration 赋回去，然后再 transform 就会有渐变效果。
      setTimeout( function () {     // 而使用 setTimeout 则后面 正式的 toPosition 也需要 setTimeout。
        style.transitionDuration = null
      }, 16)
    }
  }

  Class.prototype.getNextIndex = function() {
    var loop = this.options.loop,
      status = this.status,
      curIndex = this.curIndex,
      to;
      
    // status 有几种情况： left, right, number
    if (typeof status === 'number') {
      return loop ? status + 1 : status
    } else {
      to = status === 'right' ? curIndex + 1 : curIndex - 1
      return to >= 0 ? to % this.length : this.length + to
    }
  }

  Class.prototype.slide = function() {
    if (this.lock) return
    this.lock = true
    clearTimeout(this.timer)


    var _this = this,
        index = this.curIndex,
        toIndex = this.getNextIndex()

    if (this.options.loop) {
      if (index === 0 && this.status === 'left') {
        this.toPosition(this.length - 2, true)            // 突变位置
        this.curIndex = this.length - 2                   // 修改 curIndex
        toIndex = this.length - 3
      } else if (index === this.length - 2 && this.status === 'right') {
        this.toPosition(0, true)
        this.curIndex = 0
        toIndex = 1
      }
    }
    
    setTimeout(() => {
      this.toPosition(toIndex)
      this.changeIndex(this.options.loop ? toIndex - 1 : toIndex)
    }, 16)

    setTimeout(function() {
      _this.lock = false                      // 解锁
      _this.curIndex = toIndex                // 更新 curIndex
      _this.status = _this.options.direction  // 还原 status

      var call = _this.options.callback
      var index = _this.options.loop ? toIndex - 1 : toIndex
          index = index >= 0 ? index : index + _this.length - 2
      call && call.call(_this, {
        index: index
      })

      _this.autoplay()
    }, 300 - 16)
  }

  Class.prototype.cloneNode = function (){
    var first = this.oList.firstElementChild.cloneNode(true),
        last = this.oList.lastElementChild.cloneNode(true)
    this.oList.insertBefore(last, this.oList.firstElementChild)
    this.oList.appendChild(first)
  }

  Class.prototype.changeIndex = function(index) {
    var indicator = this.options.elem.getElementsByClassName('indicator')[0],
    act = indicator.getElementsByClassName('active')[0]
    act && act.classList.remove('active')
    var cur = indicator.children[index >= 0 ? index : index + this.length - 2]
    cur && cur.classList.add('active')
  }
  
  Class.prototype.initIndicator = function(){
    var indicator = this.options.elem.getElementsByClassName('indicator')[0]
    var _this = this
    indicator.addEventListener(this.options.trigger, function(e) {
      if (e.target.tagName === 'SPAN') {
        var index = 0, target = e.target
        while (target = target.previousElementSibling) {
          index++
        }
        if ((_this.options.loop && index === _this.curIndex - 1)
          || (!_this.options.loop && index === _this.curIndex)
        ) return
        console.log(index)
        _this.status = index
        _this.slide()
      }
    })
  }
  Class.prototype.initArrow = function(){
    var arrowLeft = this.options.elem.getElementsByClassName('arrow-left')[0]
    var arrowRight = this.options.elem.getElementsByClassName('arrow-right')[0]
    arrowLeft.addEventListener('click', e => {
      this.status = "left"
      this.slide()
    })
    arrowRight.addEventListener('click', e => {
      this.status = "right"
      this.slide()
    })
  }

  return function(ops = {}) {
    ops.elem = this
    return (this.swipeInstance = new Class(ops))
  }

})()


// 仿 jQuery 扩展, 未处理 never-ending loop，特殊类型
function extend() {
  var target = arguments[0], i = 1, deep = false, origin
  if (typeof target === 'boolean') {
    deep = target
    target = arguments[1] || {},
    i++
  }
  
  var isArr = v => Object.prototype.toString.call(v) === '[object Array]'

  for (; i < arguments.length; i++){
    origin = arguments[i] || {}

    for (let i in origin) {
      if (origin.hasOwnProperty(i)) {
  
        if (deep && typeof origin[i] === 'object') {
          if (isArr(origin[i])) {
            target[i] = []
          } else {
            target[i] = {}
          }
          extend(target[i], origin[i])
        } else if (origin[i] !== undefined) {
          target[i] = origin[i]
        }
  
      }
    }
  }

  return target
}