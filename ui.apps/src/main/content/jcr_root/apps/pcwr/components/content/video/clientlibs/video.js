function videoInit(elementId, isModal, isYouTube) {
	
	var video = document.getElementById(elementId);
	
	if(isYouTube) {
		var iframeId = "iframe-" + elementId;
		youtubeTrack(iframeId);

		if(!isModal) return;
	
		// isModal && isYouTube
		
		var modal = $(video);
		var iframe = modal.find('iframe')[0];
		modal.on('shown.bs.modal', function () {
			iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
		});
		modal.on('hide.bs.modal', function () {
			iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
		});
		return;
	}

	// all remaining code is for non-youTube only
	
	if(isModal) {
		var modal = $(video);
		var video = modal.find('video')[0];
		
		modal.on('shown.bs.modal', function () {
			video.play();
		});
		modal.on('hide.bs.modal', function () {
			video.pause();
		});
	}
	
	// all of the remaining code is non-youtube non-modal
	
	var videoOpen = false;
    // delay (in ms) due to buggy player implementation
    // when seeking, video.currentTime is not updated correctly so we need to delay
    // retreiving currentTime by an offset
    var delay = 250;
    //mouse up flag
    var isMouseUp = true;
    //store currentTime for 1 second
    var pauseTime = 0;

    if (video && video.addEventListener) {
        video.addEventListener("playing", play, false);
    }

    function open() {
        
        video.addEventListener("pause", pause, false);
        video.addEventListener("ended", ended, false);
        video.addEventListener("seeking", pause, false);
        video.addEventListener("seeked", play, false);
         
        //store flag for mouse events in order to play only if the mouse is up
        video.addEventListener("mousedown", mouseDown, false);
        video.addEventListener("mouseup", mouseUp, false);
        function mouseDown(){ 
            isMouseUp=false;
        } 
        function mouseUp(){ 
            isMouseUp = true;
        }

        storeVideoCurrentTime();
    }

    function play() {
        
        // open video call
        if (!videoOpen) {
            open();
            videoOpen = true; 
        } else {
            //send pause event before play for scrub events
            pause();
            setTimeout(playDelayed, delay);
        }
    }

    function playDelayed() {
        if (isMouseUp){
        	// ...
        }
    }

    function pause() {
    }

    function ended() {
        videoOpen = false;
        pauseTime = 0;
    }
    
    //store current time for one second that will be use for pause
    function storeVideoCurrentTime() {
        timer = window.setInterval(function() {
            if (video.ended != true) {
                pauseTime = Math.floor(video.currentTime); 
            } else { 
                window.clearInterval(timer);
            }
        },1000);
    }
}