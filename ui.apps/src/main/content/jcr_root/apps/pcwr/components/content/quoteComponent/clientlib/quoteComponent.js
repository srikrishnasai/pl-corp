if ($('.quoteImgWrapper').length > 0) {

	$(window).resize(function() {
		$('.quoteImgWrapper').each(function(index, element) {
			var largeImg = $(this).find('.landing-lg-img').val();
            var smallImg = $(this).find('.landing-sm-img').val() === 'false1' ? largeImg  : $(this).find('.landing-sm-img').val() ;
			if($(window).width() < 576) {
				$(this).find('.quoteImage').css("background-image","url(" + encodeURI(smallImg) +")");
                $(this).find('.quoteImageMain').attr('src', smallImg);
			}
			else {
				$(this).find('.quoteImage').css("background-image","url(" + largeImg +")");
                $(this).find('.quoteImageMain').attr('src', largeImg);
			}
		});
	});
}