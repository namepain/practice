/**
 * 利用 IntersectionObserver 观察图片可见性，达到懒加载
 */

function lazy() {

  var ob = new IntersectionObserver(function(changes) {

    changes.forEach(function(change) {
      if (change.isIntersecting && change.target.getAttribute("lazy")) {

        var img = new Image()
        var target = change.target
        img.onload = function() {
          ob.unobserve(target)
          target.src = this.src
        }
        img.onerror = function() {
          ob.observe(target)
        }
        img.src = target.getAttribute("lazy")

      }
    })

  })

  Array.from(document.getElementsByTagName('img')).forEach(function(item) {

    ob.observe(item)

  })

}