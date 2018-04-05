(function(){
  $('input.search-input')
    .on('input', function(){
      getData(this.value);
    })
    .on('blur', function(){
      setTimeout(function(){
        $('#search_suggest').hide();
      }, 200);
    });

  $(window).on('load', position).resize(position);
  
  function position(){
    var set = $('div.input').offset(),
      height = $('div.input').outerHeight();
    $('#search_suggest').css({
      top: set.top + height - 3 + 'px',
      left: set.left + 'px'
    });
  }

  function getData(val){
    $.ajax({
      type: 'get',
      url: 'https://api.douban.com/v2/music/search?q=' + val + '&count=7',
      dataType: 'jsonp',
      success: function(data){
        render(data);
      }
    })
  }

  function render(data){
    if(data && data.musics && data.musics.length){
      $('#search_suggest ul').html(data.musics.map(function(ele, i){
        return '<li>\
        <a href="' + ele.alt + '">\
          <img src="' + ele.image + '" alt="' + ele.alt + '">\
          <div>\
            <em>' + ele.title + '</em>\
          </div>\
        </a>\
      </li>'
      }).join('')).parent().show();
    } else {
      $('#search_suggest').hide();
    }
  }
})();
