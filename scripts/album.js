// -- EXAMPLE ALBUM --

var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism Records',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26' },
    { title: 'Green', duration: '3:12' },
    { title: 'Red', duration: '1:58' },
    { title: 'Pink', duration: '4:01' },
    { title: 'White', duration: '2:15' }
  ]
};

// -- SECOND EXAMPLE ALBUM --

var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'Tele Records',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    { title: 'Hello, Operator?', duration: '1:01' },
    { title: 'Ring, ring, ring', duration: '5:01' },
    { title: 'Text me like a normal person', duration: '2:54' },
    { title: 'Can you hear me now?', duration: '3:49' },
    { title: 'Wrong number ', duration: '0:12' }
  ]
};

// -- THIRD EXAMPLE ALBUM --

var albumEmoji = {
  title: 'Songs of Emoji',
  artist: 'Dr Moji',
  label: 'Text Records',
  year: '2016',
  albumArtUrl: 'assets/images/album_covers/02.png',
  songs: [
    { title: 'Smiley', duration: '1:01' },
    { title: 'Dancing Lady in Red', duration: '5:01' },
    { title: 'Cool Sunglasses', duration: '2:54' },
    { title: 'Taco Emoji', duration: '3:49' },
    { title: 'Poop Emoji', duration: '0:12' }
  ]
};


// -- DYNAMICALLY GENERATE SONG ROW CONTENT --

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '<td class="song-item-title">' + songName + '</td>'
  + '<td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = $(this).attr('data-song-number');

      if (currentlyPlayingSong !== null) {
  // Revert to song number for currently playing song because user started playing new song.
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingCell.html(currentlyPlayingSong);
      }

      if (currentlyPlayingSong !== songNumber) {
  // Switch from Play -> Pause button to indicate new song is playing.
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSong = songNumber;
      }

      else if (currentlyPlayingSong === songNumber) {
  // Switch from Pause -> Play button to pause currently playing song.
        $(this).html(playButtonTemplate);
        currentlyPlayingSong = null;
      }
  };

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');

    if (songNumber !== currentlyPlayingSong) {
      songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');

    if (songNumber !== currentlyPlayingSong) {
      songNumberCell.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

// -- SET CURRENT ALBUM WHEN WINDOW.ONLOAD --
var setCurrentAlbum = function(album) {
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

// Play & Pause Buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

// ONLOAD
$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
});


// -- EVENT LISTENER ON CLICK TOGGLE BETWEEN ALBUMS --
var albums = [albumPicasso, albumMarconi, albumEmoji];
var index = 1;

$('.album-cover-art').click(function(event) {
  setCurrentAlbum(albums[index]);
  index++;
    if (index == albums.length) {
      index = 0;
    }
});
