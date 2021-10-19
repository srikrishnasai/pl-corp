//Logic to update BG image based on screen size
if ($('.detail-hero-img-overlay').length > 0) {

	$(window).resize(function() {
		$('.detail-hero-img-overlay').each(function(index, element) {
			var smallImg = $(this).find('.landing-sm-img').val();
			var largeImg = $(this).find('.landing-lg-img').val();

			if($(window).width() < 576) {
				$(this).find('.landing-hero-background-img').css("background-image","url(" + smallImg +")");
			}
			else {
				$(this).find('.landing-hero-background-img').css("background-image","url(" + largeImg +")");

			}

		});

	});

}

/* Removes the Animate Style Library classes when the mobile animations are not enabled*/
var disableLandingHeroMobileAnimations = function() {
	var windowWidth = window.innerWidth;
	if(windowWidth <= 767) {
		var $landingHeroComponent = $('.landing-hero-component');
		$landingHeroComponent.each(function() {
			var mobileAnimationsDisabled = $(this).hasClass('landing-hero-mobile-animations-disabled');
			if(mobileAnimationsDisabled) {
				$(this).find('.detail-hero-img-overlay').removeClass('zoom');
			
				var $landingOverlay = $(this).find('.landing-overlay');
				PacLife.JSUtils.removeAnimationClassNames($landingOverlay, "animate");

				var $landingHeroContent = $(this).find('.landing-component-content-wrapper');
				PacLife.JSUtils.removeAnimationClassNames($landingHeroContent, "animate");
			}
		});
	}
}

$(document).ready(function() {
	disableLandingHeroMobileAnimations();
});