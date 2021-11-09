function openVideoModal(element) {
    $(element).parents('.row').find('.pcwr-modal-video').modal();
}
$(document).ready(function() {
    var activateAltFiftyCarousel = function(elem) {
        var isAnimationDone = elem.closest('.alt-fifty-component').find('.go').length > 0 || elem.attr('data-animations-disabled') == 'true' ? true : false;
            if(isAnimationDone) {
                setTimeout(function() {
                    elem.carousel();
                    var carouselIndicators = elem.find('.alt-fifty-carousel-indicator');
                    if(carouselIndicators && carouselIndicators.length > 1) {
                        carouselIndicators.first().addClass('active');
                    }
                }, 1000);
            } else {
                setTimeout(function() {
                    activateAltFiftyCarousel(elem);
                });
            }
    };
    $('.altFiftyCarousel').each(function() {
        activateAltFiftyCarousel($(this));
    });
    document.addEventListener("visibilitychange",function() {
        if(document.visibilityState === "visible"){
            $('.altFiftyCarousel').each(function() {
                $(this).carousel('next');
            })
        }
    });
});