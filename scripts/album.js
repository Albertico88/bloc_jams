//  Handles the assignment of the current playing song
var setSong = function(songNumber) {
  // Prevents multiple songs from playing simultaniously.
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURl, {
    formats: ['mp3'],
    preload: true
  });

  setVolume(currentVolume);   // var currentVolume = 85;
};


var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};


var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
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
    var songNumber = parseInt($(this).attr('data-song-number')); // what is (this) here? clickHandler?..

  // Revert to song number for currently playing song because user started playing a new song.
  // if currentlyPlayingSongNumber is NOT null, get the currentlyPlayingCell and set it's HTML to the currentlyPlayingSongNumber.
      if (currentlyPlayingSongNumber !== null) {
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }

  // PLAYING -- Switch button from PLAY to PAUSE button to indicate new song is playing.
  // if the currentlyPlayingSongNumber doesn't equal the current songNumber, grab this and set it to the pauseButtonTemplate. Set the song by passing in the song number to that function. Play the selected song. Set the currentSongFromAlbum to the appropriate song's array index. Update the PlayerBar.
      if (currentlyPlayingSongNumber !== songNumber) {
        $(this).html(pauseButtonTemplate); // $(this) refering to songNumber above.
        setSong(songNumber);
        currentSoundFile.play();
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();
      }

  // PAUSED -- Switch button from PAUSE to PLAY button to pause currently playing song.
  // if currentlyPlayingSongNumber is the song that was clicked, songNumber do one of the following: If the current song is paused, replace the songNumber with the pauseButtonTemplate, update the playerBar to display the pauseButton. Play the selected song. ELSE, replace the songNumber with the playButtonTemplate, update the playerBar Play Button annd pause the song.
      else if (currentlyPlayingSongNumber === songNumber) {
        if (currentSoundFile.isPaused()) {
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
        } else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
        }
      }
  };

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler); // jQuery CLICK event
  $row.hover(onHover, offHover); // jQuery HOVER event
  return $row;
};


// -- SET CURRENT ALBUM
var setCurrentAlbum = function(album) {
  currentAlbum = album;
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

// Returns the Song Object index
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};


var nextSong = function() {

  var getLastSongNumber = function(index) {
    return index == 0 ? currentAlbum.songs.length : index;
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Note that we're _incrementing_ the song here
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  // Set a new current song

  setSong(currentSongIndex + 1)
  currentSoundFile.play();
  updatePlayerBarSong();

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {

  var getLastSongNumber = function(index) {
    return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Note that we're _decrementing_ the index here
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updatePlayerBarSong();

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};


// ---- MUSIC PLAYER BAR ----

// Update Player Bar Song Name and Artist
var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
};

// -- SEEK BAR --
// (1) The function must take two arguments, one for the seek bar to alter (either the volume or audio playback controls) and one for the ratio that will determine the width and left values of the .fill and .thumb classes.
// (2) The ratio must be converted to a percentage so we can set the CSS property values as percents
// (3) The percentage must be passed into jQuery functions that set the width and left CSS properties
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100; // we multiply by 100 to determine %

// we use the built-in JavaScript Math.max() function to make sure our percentage isn't less than zero and the Math.min() function to make sure it doesn't exceed 100
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

// we convert our percentage to a string and add the % character. When we set the width of the .fill class and the left value of the .thumb class, the CSS interprets the value as a percent instead of a unit-less number between 0 and 100.
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: precentageString});
};


// Method for determining the seekBarFillRatio. We will use a click event to determine the fill width and thumb location of the seek bar.
var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
// pageX = jQuery-specific event value, which holds the X coordinate (horizontal).
// We subtract the offset() of the seek bar held in $(this) from the left side.
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();

// we divide offsetX by the width of the entire bar to calculate seekBarFillRatio.
    var seekBarFillRatio = offsetX / barWidth;

// we pass $(this) as the $seekBar argument and seekBarFillRatio for its eponymous argument to updateSeekBarPercentage()
    updateSeekPercentage($(this), seekBarFillRatio);
  });

// Dragging the Thumb Position:
// we find elements with a class of .thumb inside our $seekBars and add an event listener for the mousedown event. A click event fires when a mouse is pressed and released quickly, but the mousedown event will fire as soon as the mouse button is pressed down.
  $seekBars.find('.thumb').mousedown(function(event) {

  // $(this) will be equal to the .thumb node that was clicked. Because we are attaching an event to both the song seek and volume control, this is an important way for us to determine which of these nodes dispatched the event. We can then use the parent method, which will select the immediate parent of the node. This will be whichever seek bar this .thumb belongs to.
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      
    });
  });
};


// Play & Pause Buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store the current state of album, song number, song object and sound file
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null; //holds the currently playing song object from the songs array
var currentSoundFile = null;
var currentVolume = 85;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

// ONLOAD
$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
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
