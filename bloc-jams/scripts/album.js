var setSong = function (songNumber) {

    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume);
};

var setVolume = function (volume) {
  if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function (number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function () {

         var songNumber = parseInt($(this).attr('data-song-number'));

         // songNumber
         if(currentlyPlayingSongNumber !== null) {																	// if there is a song currently playing
     			var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
     			$currentlyPlayingCell.html(currentlyPlayingSongNumber);  								// change the currently playing song's number cell back to it's track number
     		}

     		if(currentlyPlayingSongNumber !== songNumber) {    										    // if the song clicked is not the one currently playing
     			$(this).html(pauseButtonTemplate);																			// change the number cell to the pause button
     			setSong(songNumber);																										// update the currently playing song variables
     			currentSoundFile.play();
     			updatePlayerBarSong();
     		}
     		else if(currentlyPlayingSongNumber === songNumber) {											// if the song clicked is the one currently playing
     			if(currentSoundFile.isPaused()) {
     				$(this).html(pauseButtonTemplate)
     				$('.main-controls .play-pause').html(playerBarPauseButton);
     				currentSoundFile.play();
     			} else {
     				$(this).html(playButtonTemplate);																				// change the number cell back to the play button
     				$('.main-controls .play-pause').html(playerBarPlayButton);
     				currentSoundFile.pause();
     			}
     		}
      };

      var onHover = function(event) {
    		var $songNumberCell = $(this).find('.song-item-number');
    		var songNumber = parseInt($songNumberCell.attr('data-song-number'));

    		if(songNumber !== currentlyPlayingSongNumber) {
    				$songNumberCell.html(playButtonTemplate);
    			}
    	};

    	var offHover = function(event) {
    		var $songNumberCell = $(this).find('.song-item-number');
    		var songNumber = parseInt($songNumberCell.attr('data-song-number'));

    		if(songNumber !== currentlyPlayingSongNumber) {
    			$songNumberCell.html(songNumber);
    		}
    	};


     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

  var setCurrentAlbum = function(album) {
      currentAlbum = album;
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

  var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
  };

 var updatePlayerBarSong = function() {

     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

     $('.main-controls .play-pause').html(playerBarPauseButton);
 };

  var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
  var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
  var playerBarPlayButton = '<span class="ion-play"></span>';
  var playerBarPauseButton = '<span class="ion-pause"></span>';


  // store the current playing song
 var currentAlbum = null;
 // var setSong = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $playButton = $('.main-controls .play-pause');
 var $nextButton = $('.main-controls .next');

 var previousSong = function() {

 	var getLastSongNumber = function(index) {
 		return index==currentAlbum.songs.length - 1 ? 1 : index+2;
 	};

 	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
 	currentSongIndex === 0 ? currentSongIndex = currentAlbum.songs.length - 1 : currentSongIndex--;

 	// Set new current song
 	setSong(currentSongIndex+1);

 	// start playing new song
 	currentSoundFile.play();

 	// update player bar
 	updatePlayerBarSong();

 	var lastSongNumber = getLastSongNumber(currentSongIndex);
 	var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
 	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

 	$previousSongNumberCell.html(pauseButtonTemplate);
 	$lastSongNumberCell.html(lastSongNumber);
 };

 var togglePlayFromPlayerBar = function() {
  	var $currentSong = getSongNumberCell(currentlyPlayingSongNumber);
  	if(currentSoundFile) {
  		if(currentSoundFile.isPaused()) {
  			$currentSong.html(pauseButtonTemplate);
  			$(this).html(playerBarPauseButton);
  			currentSoundFile.play();
  		} else {
  			$currentSong.html(playButtonTemplate);
  			$(this).html(playerBarPlayButton);
  		  currentSoundFile.pause();
  	 }
  	}
};

var nextSong = function() {

	var getLastSongNumber = function(index) {
		return index==0 ? currentAlbum.songs.length : index;
	}

	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex === currentAlbum.songs.length - 1 ? currentSongIndex = 0 : currentSongIndex++;

	// Set new current song
	setSong(currentSongIndex+1);

	// start playing new song
	currentSoundFile.play();


	// update player bar
	updatePlayerBarSong();

	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};


 $(document).ready(function () {
         setCurrentAlbum(albumPicasso);
         $previousButton.click(previousSong);
         $nextButton.click(nextSong);
         $playButton.click(togglePlayFromPlayerBar);
     });

     var albums = [albumPicasso, albumMarconi, albumCher];
     var index = 1;

     // albumImage.addEventListener
     $albumImage.on("click", function(event) {
        setCurrentAlbum(albums[index]);
        index++;
        if (index == albums.length) {
            index = 0;
        }
     });
