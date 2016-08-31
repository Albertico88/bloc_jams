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

  return template;
};

// -- SET CURRENT ALBUM WHEN WINDOW.ONLOAD --

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = ' ';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow( i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

// Change SONG-ITEM-NUMBER to --> PAUSE BUTTON

var findParentByClassName = function(element, targetClass) {
  if (element) {
    var currentParent = element.parentElement;

    if (currentParent.className === null) {
      alert('No Parent Found');
    } else if (currentParent.className !== targetClass) {
      alert('No Parent Found with that class name');
    } else {

      while (currentParent.className != targetClass && currentParent.className !== null) {
        currentParent = currentParent.parentElement;
      }
    return currentParent;
    }
  }
};

var getSongItem = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
      return element;
    default:
      return;
  }
};

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);

  if (currentlyPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
    songItem.innerHTML = playButtonTemplate;
    currentlyPlayingSong = null;
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }
};


// -- EVENT LISTENERS --

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');


// Play & Pause Buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

setCurrentAlbum(albumPicasso);


// When MOUSEOVER set Play Button
  songListContainer.addEventListener('mouseover', function(event) {
    if (event.target.parentElement.className === 'album-view-song-item') {
        // The TARGET property on the EVENT object stores the DOM element where the event occurred.
        var songItem = getSongItem(event.target);
        console.log('Hovered over item ' + songItem.getAttribute('data-song-number'))

          if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
            songItem.innerHTML = playButtonTemplate;
          }
    }
  });


// When MOUSELEAVE, set song number back
  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

        if (songItemNumber !== currentlyPlayingSong) {
          songItem.innerHTML = songItemNumber;
        }
    });

// CLICK EVENT LISTENER
    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }


// -- EVENT LISTENER ON CLICK TOGGLE BETWEEN ALBUMS --

var albums = [albumPicasso, albumMarconi, albumEmoji];
var index = 1;

albumImage.addEventListener("click", function(event) {
  setCurrentAlbum(albums[index]);
  index++;
    if (index == albums.length) {
      index = 0;
    }
  });
