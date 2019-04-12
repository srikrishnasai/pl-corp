"use strict";
use(function() {
	var path = properties.get("video");	
	var matches = /https?:\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)(\w+)(.*)/.exec(path);
	if(matches == null) {
		return {
			isConfigured: false
		};
	}
	else {
		// check for video URLs containing extra parameters
		var separator = matches[2] ? "&" : "?";
		return {
			isConfigured:  true,
			videoIframeUrl: "https://www.youtube.com/embed/" + matches[1] + matches[2] + separator + "enablejsapi=1"
		};
	};
});