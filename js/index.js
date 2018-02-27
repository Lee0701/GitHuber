---
---
var page = 1;

$(document).ready(function() {
  $.ajax({
    url: '{{ site.baseurl }}/write',
    success: function(result) {
      $('#write').append(result)
    }
  })
  
  $.ajax({
    url: '{{ site.baseurl }}/page',
    success: function(result) {
      $('#content').append(result)
    }
  })
  
  $('#loadmore').click(function() {
    page++;
    $.ajax({
      url: '{{ site.baseurl }}/page/' + page + '/',
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
})

