//Logic to update BG image based on screen size
if ($('.detail-hero-img-overlay').length > 0) {

	$(window).resize(function() {
		$('.detail-hero-img-overlay').each(function(index, element) {
			var smallImg = $(this).find('.landing-sm-img').val();
			var largeImg = $(this).find('.landing-lg-img').val();

			if($(window).width() < 576) {
				$(this).css("background-image","url(" + smallImg +")");
			}
			else {
				$(this).css("background-image","url(" + largeImg +")");
			}

		});

	});

}