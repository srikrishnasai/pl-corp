$(document).ready(function() {
	
	makeInlineIframeVideoResponsive();
	
	makeModalIframeVideoResponsive();

});


function makeInlineIframeVideoResponsive() {
	
	var $allVideos = $(".youtube-iframe-div iframe[id^='iframe-']");

	// Figure out and save aspect ratio for each video
	$allVideos.each(function() {
		
	  $(this)
	    .data('aspectRatio', this.height / this.width)

	    // and remove the hard coded width/height
	    .removeAttr('height')
	    .removeAttr('width');

	});

	// When the window is resized
	$(window).resize(function() {
	  // Resize all videos according to their own aspect ratio
	  $allVideos.each(function() {

		var newWidth = $(this).parent().width();
		    var $el = $(this);
		    $el.width(newWidth).height(newWidth * $el.data('aspectRatio'));

	  });

	// Kick off one resize to fix all videos on page load
	}).resize();
}


function makeModalIframeVideoResponsive() {

	$('.modal').on('shown.bs.modal',function() {
				
		var iframe = $(this).find('iframe')[0];

		if (iframe) {
			var $iframe = $(iframe);
			$iframe.data('aspectRatio', $iframe.height() / $iframe.width())
					.removeAttr('height').removeAttr('width');
		
			// When the window is resized
			$(window).resize(function() {
				
				var newWidth = $iframe.parent().width();   
				if(newWidth) {
					$iframe.width(newWidth).height(newWidth * $iframe.data('aspectRatio'));
				}			    
			// Kick off one resize to fix all videos on page load
			}).resize();
			
		}

	});

}
