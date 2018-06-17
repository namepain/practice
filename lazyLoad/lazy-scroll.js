/**
 * 传统方式，监听 scroll 事件，判断图片是否进入视口
 */

function lazy() {

  var images = Array.from(document.getElementsByTagName('img')).filter(x => x.getAttribute('lazy'))

  function isShow(el) {
    var rect = el.getBoundingClientRect()
    var top = rect.top, bottom = rect.bottom
    return (top > 0 && top < window.innerHeight) || (bottom > 0 && bottom < window.innerHeight)
  }

  function load(){
    images.forEach(function(image) {

      if (isShow(image)) {
        var img = new Image()
        img.onload = function() {
          image.src = img.src
          remove(image)
        }
        img.onerror = function() {
          remove(image)
        }
        img.src = image.getAttribute('lazy')
      }
  
    })
  }

  function remove(img) {

    for(var i = 0; i < images.length; i++) {
      if (img === images[i]) {
        images.splice(i, 1)
        return;
      }
    }

  }

  load()
  window.addEventListener('scroll', load)

}