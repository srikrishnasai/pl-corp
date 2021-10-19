"use strict";
use(function() {
	var path = properties.get("inlineVideo/video");	
	var autoplay = properties.get("inlineVideo/autoplay") ? '1&muted=1' : '0&muted=0';
	var controls = properties.get("inlineVideo/hideControls") ? '0' : '1';
	var loop = properties.get("inlineVideo/loop") ? '1' : '0';	
	var matches = /https?:\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)(\w+-*\w+)(.*)/.exec(path); // Adding -* as an option (\w+)
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
			videoIframeUrl: "https://www.youtube.com/embed/" + matches[1] + matches[2] + separator + "enablejsapi=1&playlist=" + matches[1] + "&autoplay=" + autoplay + "&controls=" + controls + "&loop=" + loop
		};
	};
});