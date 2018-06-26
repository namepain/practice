// 缓冲运动回到顶部
~function fn(){
	requestAnimationFrame(() => {
		var y = window.pageYOffset
		y && window.scrollBy(0, - y / 9.8)
		y && fn()
	})
}()

// 写一个函数，简化linux相对路径（如 /a/b/.././c => /a/c）
function path(path){
	var arr = path.split('/')
	return arr.reduce((a,b) => {
		return b === '..' ? a.slice(0, -1) : (b === '.' ? a : a.concat(b))
	}, []).join('/')
}

// 千分符 逗号
function thousandCharacter(str){
	return str.replace(/(\B)(?=(\d{3})+(\.\d+)?$)/g, ',')
}
// '5207031001001.99'.replace(/(\B)(?=(\d{3})+(\.\d+)?$)/g, ',')

// 倒计时函数
function countdown(end, call){
	var diff = new Date(end) - new Date()
	var time = [
		Math.floor(diff / (1000 * 60 * 60 * 24)), 	// 天
		Math.floor(diff / (1000 * 60 * 60)) % 24, 	// 时
		Math.floor(diff / (1000 * 60)) % 60, 				// 分
		Math.floor(diff / 1000) % 60								// 秒
	]
	call && call(diff <=0 ? [0,0,0,0] : time)
	var timer = setTimeout(function() {
		countdown(end, call)
	}, 1000)
	if (diff <= 0 ) clearTimeout(timer)
	return timer
}