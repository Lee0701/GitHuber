---
---

$(document).ready(function() {
  
  var code = $.urlParam('code')
  
  $('#signin-button').click(function() {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id={{ site.github_client_id }}&redirect_uri=' + location.href
  })
  const username = '{{ site.github_username }}'
  const repo = 'GitHuber'
  const branch = 'master'
  const date = new Date().format("yyyy-MM-dd-HH-mm-ss")
  
  var options = {}
  var user = undefined
  
  if(typeof(Storage) != 'undefined' && sessionStorage.token != undefined) {
    options['github-token'] = sessionStorage.token
    user = sessionStorage.user
    $('#write-form').css('display', 'block')
  } else if(code != undefined) {
    $.ajax({
      type: 'GET',
      url: 'https://api.staticman.net/v2/auth/github/' + username + '/' + repo + '/' + branch + '/write?code=' + code,
      success: function(result) {
        $('#signin-form').css('display', 'none')
        const token = result.accessToken;
        if(token == undefined) {
          console.log(result)
          $('#signin-form').css('display', 'block')
        } else {
          if(typeof(Storage) == 'undefined') {
            user = result.user
            options['github-token'] = token
            $('#write-form').css('display', 'block')
          } else {
            sessionStorage.token = token
            sessionStorage.user = result.user
            location.href = location.href.split('?')[0]
          }
        }
      },
      error: function(xhr, status, error) {
        $('#signin-form').css('display', 'block')
      }
    })
  } else {
    $('#signin-form').css('display', 'block')
  }
  
  $('#submit').click(function() {
    $('#submit').css('display', 'none')
    $('#submit-wait').css('display', 'inline-block')
    
    var fields = {}
    fields.name = user.login
    fields.message = $('#message')[0].value
    fields.time = date
    if(typeof(replytourl) != 'undefined') fields.replytourl = replytourl
    if(typeof(replytoname) != 'undefined') fields.replytoname = replytoname
    
    $.ajax({
      type: 'POST',
      url: 'https://api.staticman.net/v2/entry/' + username + '/' + repo + '/' + branch + '/write',
      data: {
        options: options,
        fields: fields
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