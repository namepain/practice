(function($){
  var defaultOps = {
    current: 1,
    total: 10,
    el: null
  };

  function init(ops) {
    goPage();
    bindEvent();
  }
  function renderPage(cur, total) {
    var str = '',
    start = cur <= 3 ? 2 : cur - 2,
    end = cur >= total -3 ? total - 1 : cur + 2,
    oDom = defaultOps.el;

    // 第一页
    if(cur == 1) {
      str += '<span class="disabled">prev</span>'
          +  '<span class="page-num curr">1</span>'
    } else {     
      str += '<span class="page-prev">prev</span>'
          +  '<span class="page-num">1</span>'
    }

    // 大于 4, 左省略号
    if(cur > 4) {
      str += '<span class="dot">...</span>'
    }

    for(; start <= end; start ++) {
      str += '<span class="page-num'
          + (start == cur ? ' curr' : '')
          + '">' + start + '</span>'
    }

    // 小于 total - 3， 右省略号
    if(cur < total - 3) {
      str += '<span class="dot">...</span>'
    }

    // 最后一页
    if(total === 1) {
      str += '<span class="disabled">next</span>'
    } else if(cur == total) {
      str += '<span class="page-num curr">' + total + '</span>'
          + '<span class="disabled">next</span>'
    } else {
      str += '<span class="page-num">' + total + '</span>'
          + '<span class="page-next">next</span>'
    }

    oDom.empty().append(str);
  }

  function bindEvent(){
    $(defaultOps.el)
      .off('click')
      .on('click', '.page-prev', prev)
      .on('click', '.page-next', next)
      .on('click', '.page-num:not(".curr")', change)
  }

  function prev(e) {
    goPage(defaultOps.current - 1);
  }
  
  function next(e) {
    goPage(defaultOps.current + 1);
  }

  function change(e) {
    goPage(+$(e.currentTarget).text());
  }

  function goPage(num){
    if(num !== undefined) {
      defaultOps.current = num;
    }
    renderPage(defaultOps.current, defaultOps.total);
    typeof defaultOps.jump == 'function' && defaultOps.jump(defaultOps.current);
  }

  $.fn.cPage = function(ops) {
    init($.extend(defaultOps, ops, {el: $(this)}));
  }
})($)