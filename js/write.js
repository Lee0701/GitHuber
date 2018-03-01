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
    $('#submit').css('display', 'none')
    $('#submit-wait').css('display', 'inline-block')
    
    var fields = {}
    fields.name = user.login
    fields.message = $('#message')[0].value
    fields.time = date
    if(typeof(replytourl) != "undefined") fields.replytourl = replytourl
    if(typeof(replytoname) != "undefined") fields.replytoname = replytoname
    
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