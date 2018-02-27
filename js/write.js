---
---
Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";
 
  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;
   
  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
    switch ($1) {
      case "yyyy": return d.getFullYear();
      case "yy": return (d.getFullYear() % 1000).zf(2);
      case "MM": return (d.getMonth() + 1).zf(2);
      case "dd": return d.getDate().zf(2);
      case "E": return weekName[d.getDay()];
      case "HH": return d.getHours().zf(2);
      case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm": return d.getMinutes().zf(2);
      case "ss": return d.getSeconds().zf(2);
      case "a/p": return d.getHours() < 12 ? "오전" : "오후";
      default: return $1;
    }
  });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

$.urlParam = function(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null) {
    return null;
  }
  else {
    return decodeURI(results[1]) || 0;
  }
}

$(document).ready(function() {
  
  var code = $.urlParam('code')
  
  $('#signin-button').click(function() {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id={{ site.github_client_id }}'
  })
  const username = '{{ site.github_username }}'
  const repo = 'GitHuber'
  const branch = 'master'
  const date = new Date().format("yyyy-MM-dd-HH-mm-ss")
  
  var options = {}
  var user = undefined
  
  $('#signin-form').css('display', 'block')
  
  if(code != undefined) {
    $.ajax({
      type: 'GET',
      url: 'https://api.staticman.net/v2/auth/github/' + username + '/' + repo + '/' + branch + '/write?code=' + code,
      success: function(result) {
        const token = result.accessToken;
        if(token == undefined) {
          console.log(result)
        } else {
          user = result.user
          options['github-token'] = token
          $('#username').html(user.login)
          $('#write-form').css('display', 'block')
          $('#signin-form').css('display', 'none')
        }
      }
    })
  }
  
  $('#submit').click(function() {
    $('#submit').css('display', 'inline-block')
    $('#submit-wait').css('display', 'none')
    const message = $('#message')[0].value
    $.ajax({
      type: 'POST',
      url: 'https://api.staticman.net/v2/entry/' + username + '/' + repo + '/' + branch + '/write',
      data: {
        options: options,
        fields: {
          name: user.login,
          message: message,
          time: date,
        }
      },
      success: function(result) {
        alert('success')
        location.reload()
      },
      error: function(xhr, status, error) {
        console.log(xhr)
        console.log(status)
        console.log(error)
      }
    })
  })
})