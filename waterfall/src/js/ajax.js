function ajax(method, url, data, fn){
  var query = [],
   xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActivexObject('Microsoft.XMLHttp');
  method = method.toUpperCase();
  if(method == 'GET'){
    for(k in data){
      query.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
    }  
    url += query.length ? '?' + query.join('&') : '';
    data = null;
    xhr.open(method, url, true);
  } else {
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    for(k in data){
      query.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
    }
    data = query.join('&');
  }
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if(xhr.status >= 200 && xhr.status < 300){
        typeof fn == 'function' && fn(xhr.responseText, xhr.responseXML);
      }
    }
  }
  xhr.send(data);
}