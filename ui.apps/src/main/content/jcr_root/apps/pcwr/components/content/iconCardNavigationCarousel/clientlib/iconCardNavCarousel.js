$(document).ready(function () {
    var slider = $('#lightSlider').lightSlider({
        
        gallery: false, 
        item: 5,
        loop: true,
        slideMargin: 0,
        thumbItem: 0,
        autoWidth: false,
        mode: 'slide',
        pager: false,
        controls:false,
        responsive: [{
            breakpoint: 768,
            settings: {
                gallery: false,
                item: 1,
                loop: true,
                slideMargin: 0,
                thumbItem: 0,
                //autoWidth: true,
                slideMargin:50,
                mode: 'slide',
                pager: false,
                controls:true,
                addClass:"responsive-768",
                prevHtml:"<img src='/etc/designs/pcwr/default/images/carousel-arrow-left.svg' class='carousel-arrow-left'>",
                nextHtml:"<img src='/etc/designs/pcwr/default/images/carousel-arrow-right.svg' class='carousel-arrow-right'>"
            }
        }]
    });

    $('#goToPrevSlide').click(function () {
        slider.goToPrevSlide();
    });
    $('#goToNextSlide').click(function () {
        slider.goToNextSlide();
    });
    $('#destroy').click(function () {
        slider.destroy();
    });
    $('#getCurrentSlideCount').click(function () {
        slider.getCurrentSlideCount();
    });
    
    var disableIconCardNavMobileAnimations = function() {
        var windowWidth = window.innerWidth;
        if(windowWidth <= 767) {
            var $iconCardNavCarousel = $('.icon-card-nav-carousel');
            $iconCardNavCarousel.each(function() {
                var disableMobileAnimations = $(this).hasClass('icon-card-nav-car-mobile-animations-disabled');
                if(disableMobileAnimations) {
                    PacLife.JSUtils.removeAnimationClassNames($(this), "animate");
                    $(this).removeClass('icon-card-nav-car-hover-animations-enabled');
                }
            });
        }
    }
    
    disableIconCardNavMobileAnimations();
});
