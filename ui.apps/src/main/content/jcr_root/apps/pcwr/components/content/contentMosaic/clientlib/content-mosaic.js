$(document).ready(function() {
	
	var $window = $(window);
	
	// Returns true of screen width <= 768px
	function isMobile() {
		var windowsize = $window.width();
		
		if(windowsize <= 768) {
			return true;
		}
		
		return false;
	}
	
	
	//For all cards with links, add pointer cursor.
	var clickableCards = $('.mosaic-card').has('.mosaic-card-link-value');
	clickableCards.css('cursor', 'pointer' );
	
	/*
	 * On click:
	 * 1) If NOT mobile, redirect to new page
	 * 2) If Mobile, logic to redirect on second click/tap
	 * */
	clickableCards.click(function() {
		
		if(isMobile()) {
			
			if($(this).hasClass('clicked')) {
				location.href = $(this).find('.mosaic-card-link-value').val();
			}
			else {
				clickableCards.removeClass('clicked');
				$(this).toggleClass('clicked');
			}
		}
		else {
			location.href = $(this).find('.mosaic-card-link-value').val();
		}	
	});
	
	//Wen non-clickable mosaic cards clicked, removed 'clicked' class from clickableCards
	$('.mosaic-card:not(:has(.mosaic-card-link-value))').click(function() {
		clickableCards.removeClass('clicked');
	});
	
	
});