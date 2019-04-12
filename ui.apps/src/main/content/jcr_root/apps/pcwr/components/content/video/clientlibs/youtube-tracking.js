function youtubeTrack(iframeid) {
    var passthrough = window.onYouTubeIframeAPIReady; 
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player(iframeid, {
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
        // handle multiple youtube videos on same page
        if(passthrough) passthrough();
    }
}
function onPlayerReady() {
	return true;
}
function onPlayerStateChange(event) {
	if(event.data < 0 || event.data === YT.PlayerState.BUFFERING || event.data === YT.PlayerState.CUED) {
		return;
	}
		
    if(event.data === YT.PlayerState.PLAYING) { // Started playing
        if(!event.target.percentageTracking){
        	event.target.percentageTracking = {
                    timeSpent: new Array( parseInt(player.getDuration()) ),
                    milestone: 0,
                    count: 0,
                    timer: setInterval(function() { record(event.target) }, 100)
        	}
        	event.target.a.dispatchEvent(new CustomEvent('YouTube_PLAYING'));
        }
        return;
    }  
    	
	// stop tracking
    clearInterval(event.target.percentageTracking.timer);
    
    if(event.data === YT.PlayerState.ENDED) {
    	event.target.a.dispatchEvent(new CustomEvent('YouTube_ENDED'));
    }
    else if(event.data === YT.PlayerState.PAUSED) {
    	event.target.a.dispatchEvent(new CustomEvent('YouTube_PAUSED'));
    }
}

function record(target){
	
	var slot = parseInt(player.getCurrentTime());
	var delta = !target.percentageTracking.timeSpent[slot];
	target.percentageTracking.timeSpent[slot] = true;

    if(delta) {
    	++target.percentageTracking.count;
    	var percent = Math.round(target.percentageTracking.count / target.percentageTracking.timeSpent.length * 100);
    
	    if(percent > 25*target.percentageTracking.milestone 
	    		&& (percent - 25*target.percentageTracking.milestone >= 25) 
	    		&& percent < 100) {
	    	target.percentageTracking.milestone = Math.round(percent/25);
	    	
	    	target.a.dispatchEvent(new CustomEvent('YouTube_' + target.percentageTracking.milestone*25));
	    }
    }
}

