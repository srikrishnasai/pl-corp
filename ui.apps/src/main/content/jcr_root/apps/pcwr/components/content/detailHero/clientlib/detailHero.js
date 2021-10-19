//Logic to update BG image based on screen size
if ($('.detail-hero-wrapper .detail-hero').length > 0) {

	$(window).resize(function() {
		$('.detail-hero-wrapper .detail-hero').each(function(index, element) {
			var smallImg = $(this).find('.detail-sm-img').val();
			var largeImg = $(this).find('.detail-lg-img').val();

			if($(window).width() < 576) {
				$(this).find(".detail-hero-background-img").css("background-image","url(" + smallImg +")");
			}
			else {
				// $(this).css("background-image","url(" + largeImg +")");
				$(this).find(".detail-hero-background-img").css("background-image","url(" + largeImg +")");

			}

		});

	});

}

var disableDetailHeroMobileAnimations = function() {
	var windowWidth = window.innerWidth;
	if(windowWidth <= 767) {
		var $detailHeroComponent = $('.detail-hero-component');
		$detailHeroComponent.each(function() {
			var disableMobileAnimations = $(this).hasClass('detail-hero-mobile-animations-disabled');
			if(disableMobileAnimations) {
				$(this).find('.detail-hero-content-wrapper').removeClass('detail-hero-copy--animate');

				var $detailHeroTitleWrapper = $(this).find('.detail-hero-title-wrapper');
				PacLife.JSUtils.removeAnimationClassNames($detailHeroTitleWrapper, "animate");

				var $detailHeroContent = $(this).find('.detail-hero-content-wrapper');
				PacLife.JSUtils.removeAnimationClassNames($detailHeroContent, "animate");

				var $detailHeroContentDesc = $(this).find('.detail-hero-desc');
				PacLife.JSUtils.removeAnimationClassNames($detailHeroContentDesc, "animate");
			}
		});
	}
};

var updateDetailHeroHeight = function() {
	var $detailHeroCopy = $('.detail-hero-copy');
	if($detailHeroCopy) {
		var $detailHeroDuplicate = $('.detail-hero-copy-duplicate .detail-hero-desc-duplicate');
		if($detailHeroDuplicate && $detailHeroDuplicate.length > 0) {
			var height = $detailHeroDuplicate.height();
			if(window.innerWidth > 992) {
				$detailHeroCopy.css('height', height + 120);
			} else {
				$detailHeroCopy.css('height', '100%');
			}
			
		}
	}
};

$(document).ready(function() {
	disableDetailHeroMobileAnimations();
	if(window.innerWidth > 992) {
		updateDetailHeroHeight();
	}
	$(window).resize(function() {
		updateDetailHeroHeight();
	}); 
});