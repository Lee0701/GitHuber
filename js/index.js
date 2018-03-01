---
---
var page = 0;

$(document).ready(function() {

  const p = $.urlParam('page')
  if(p != undefined) page = p
  
  $('#loadmore').click(function() {
    page++;
    $.ajax({
      url: '{{ site.baseurl }}' + '/page/' + ((page > 1) ? (page + '/') : ''),
      cache: false,
      success: function(result) {
        $('#content').append(result)
      },
      error: function(xhr, status, error) {
        if(xhr.status == 404) {
          $('#loadmore').html('No More')
        }
      }
    })
  })
  
  $('#loadmore').click()
  
})

