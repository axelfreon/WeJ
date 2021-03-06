$(document).ready(function() {
  $('#search-results').hide()
  var songArray = [];
  $('#search-box').on('keyup', function(event) {
    event.preventDefault();
    $('#search-results').hide()
    $('#search-results').empty()
    if ($('#search-box').val().length > 4) {
      console.log('keyup if')
      var data = $(this).serialize();
      $.ajax({
        url: '/spotify',
        type: 'POST',
        data: data
      })
      .done(function(response) {
        songArray = []
        // var titlesArray = [];
        for (object in response) {
          var song = new Song(response[object]);
          // titlesArray.push(song.name + " - " + song.artist)
          songArray.push(song)
        }
        var songList = new SongList(songArray)
        $('#search-results').show()
        $('#search-results').empty()
        $('#search-results').append(songList.toHtml())
      })
    }
  });

  $('#search-form').on('submit', function(event) {
    event.preventDefault();
    var id = $(this).parent().attr('id')
    var data;
    for (object in songArray) {
      if (songArray[object].name + " - " + songArray[object].artist == $('#search-box').val()) {
        var newSong = songArray[object]
        data = {song: newSong.id}
        break;
      }
    }
    if ( data ) {
      $.ajax({
        url: '/playlists/' + id,
        type: 'PUT',
        data: data
      }).done(function(response){
        $('#search-box').val('')
        $('#search-results').html('')
        $('#requests-remaining').text('Requests remaining: ' + response)
        $('#search-results').hide()
      }).error(function() {
        var modal = $('#myModal').show();
      })
    }
  });

  // display the modal when the user votes on the same song
  $("#myModal").on('click', function(){
    $('#myModal').hide();
    $('#search-box').val('')
    $('#search-results').html('');
    $('#search-results').hide()
    $('#search-box').focus()
  })

  $('#search-results').on('mouseenter', 'p', function(){
    $(this).css('background-color', '#EE6D94')
  });

  $('#search-results').on('mouseleave', 'p', function(){
    $(this).css('background-color', '#181019')
  });

  $('#search-results').on('click', 'p', function(){
    var text = $(this).text()
    $('#search-box').val(text)
  });

  $('#song-list').on('submit', '.vote-button', function(event){
    event.preventDefault();
    $.ajax({
      url: $(this).attr('action'),
      method: $(this).attr('method'),
      data: $(this).serialize()
    }).done(function(response){
      $('#requests-remaining').text('Requests remaining: ' + response)
    })
  })
});
