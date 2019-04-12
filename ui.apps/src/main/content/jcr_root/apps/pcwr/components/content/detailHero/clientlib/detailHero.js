//Logic to update BG image based on screen size
if ($('.detail-hero-wrapper .detail-hero').length > 0) {

	$(window).resize(function() {
		$('.detail-hero-wrapper .detail-hero').each(function(index, element) {
			var smallImg = $(this).find('.detail-sm-img').val();
			var largeImg = $(this).find('.detail-lg-img').val();

			if($(window).width() < 576) {
				$(this).css("background-image","url(" + smallImg +")");
			}
			else {
				$(this).css("background-image","url(" + largeImg +")");
			}

		});

	});

}