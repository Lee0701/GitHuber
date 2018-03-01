---
---

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    cache: false,
    url: 'https://api.github.com/users/{{ site.github_username }}/' + url,
    success: function(result) {
      for(var i in result) {
        const user = result[i]
        $(id).append('{% include userbox.html %}')
      }
    }
  })
})
