var disableOverviewHeroMobileAnimations = function() {
	var windowWidth = window.innerWidth;
	if(windowWidth <= 767) {
		var $overviewHeroComponent = $('.overview-hero-component');
		$overviewHeroComponent.each(function() {
			var disableMobileAnimations = $(this).hasClass('overview-hero-mobile-animations-disabled');
			if(disableMobileAnimations) {
				$(this).find('.overview-hero').removeClass('zoom-overview-hero');
			
				var $overviewHeroTitleWrapper = $(this).find('.overview-hero-content-wrapper');
				PacLife.JSUtils.removeAnimationClassNames($overviewHeroTitleWrapper, "animate");
			}
		});
	}
}

$(document).ready(function() {
	disableOverviewHeroMobileAnimations();
});