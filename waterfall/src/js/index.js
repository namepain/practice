var waterfall = {
  lists: document.getElementsByClassName('box'),
  iniWidth: 200,
  cpage: 1,
  lock: true,

  init: function(){
    this.bindEvent();
    this.getData();
  }
  , bindEvent: function(){
    var that = this;
    window.onscroll = function(){
      var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop,
        clientHeight = document.documentElement.clientHeight || document.body.clientHeight,
        pageHeight = that.getMinHeightLi().offsetHeight;
      if(scrollHeight + clientHeight > pageHeight){
        that.getData();
      }
    }
  }
  , getData: function(){
    if(!this.lock) return;
    this.lock = false;
    ajax('get', 'http://localhost/web/waterfall/getPics.php', {cpage: this.cpage}, this.render.bind(this));
    this.cpage ++ ;
  }
  , render: function(data){
    var that = this,
      iniWidth = that.iniWidth;
    data = JSON.parse(data);
    data && data.length && data.forEach(function(ele, i){
      var minHeightLi = that.getMinHeightLi();
      var oItem = document.createElement('div'),
        oImgBox = document.createElement('div'),
        oImg = document.createElement('img'),
        oP = document.createElement('p');
      oItem.className = 'item';
      oImgBox.className = 'image';

      oImg.src = ele.preview;
      oP.innerText = ele.title;

      // 设置图片高度
      oImg.style.height = ele.height * iniWidth / ele.width + 'px';
      oImgBox.style.height = ele.height * iniWidth / ele.width + 'px';

      // 图片加载错误处理
      oImg.onerror = function(){
        this.style.margin = '-1px';
        this.style.width = iniWidth + 2 + 'px';
        this.style.height = ele.height * iniWidth / ele.width + 2 + 'px';
      }

      oImgBox.appendChild(oImg);
      oItem.appendChild(oImgBox);
      oItem.appendChild(oP);
      minHeightLi.appendChild(oItem);
    });
    that.lock = true;
  }
  , getMinHeightLi: function(){
    var oLis = this.lists,
      min = oLis[0].offsetHeight,
      i = 1,
      index = 0;
    for(; i < oLis.length; i++) {
      var itemHei = oLis[i].offsetHeight;
      if(itemHei < min) {
        min = itemHei;
        index = i;
      }
    }
    return oLis[index];
  }
}

waterfall.init();