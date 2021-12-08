$(document).ready(function () {
    var checkIfElementIsVisible = function (elem) {
        // CSS3 Animate JS will add the class go to the elements present inside carousel component, when they are visible
        var startAnimation = elem.find('.animated.go');
        if (startAnimation && startAnimation.length > 0) {
            setTimeout(function() {
                startCarousels(elem);
            }, 1000);
            elem.find('.scenario-carousel-copy-carousel').addClass('animatecopycarousel');
        } else {
            setTimeout(function () {
                checkIfElementIsVisible(elem);
            });
        }
    };

    var startCarousels = function (elem) {
        var isCarousel = elem.attr('data-is-carousel');

        if (isCarousel && isCarousel === 'true' && elem.hasClass('scenario-carousel-component-animations-enabled')) {
            var percent = 0;
            var interval = 50;
            elem.find('.scenario-carousel-indicator').first().addClass('active');
     
            var $scenarioCarouselComponent = $('.scenario-carousel');

            elem.find('.scenario-carousel-images').carousel({
                interval: false,
                pause: true
            }).on('slide.bs.carousel', function () { percent = 1; });
            elem.find('.scenario-carousel-copy-carousel').carousel({
                interval: false,
                pause: true
            }).on('slide.bs.carousel', function (e) { 
                percent = 1;
                if(window.innerWidth < 768) {
                    elem.find('.scenario-carousel-images').carousel(e.to);
                }
            });

            function progressBarScenarioCarousel() {
                var $activeCarouselIndicator = elem.find('.scenario-carousel-indicator.active .animate-progress-bar');
                $activeCarouselIndicator.css({ width: percent + '%' });
                percent = percent + 0.5;
                if (percent > 100) {
                    percent = 0;
                    $activeCarouselIndicator.css({ width: '1%'});
                    elem.find('.scenario-carousel-images').carousel('next');
                    elem.find('.scenario-carousel-copy-carousel').carousel('next');
                }
            }

            var barInterval = setInterval(progressBarScenarioCarousel, interval);
            $scenarioCarouselComponent.hover(
                function () {
                    clearInterval(barInterval);
                },
                function () {
                    barInterval = setInterval(progressBarScenarioCarousel, interval);
                }
            );
        } 
        $('.scenario-carousel-indicator').on('click', function () {
            var slideTo = $(this).attr('data-slide-to');
            percent = 0;
            $(this).find('.animate-progress-bar').css('width', '100%');
            $(this).closest('.scenario-carousel-component').find('.scenario-carousel-images').carousel(Number(slideTo));
            $(this).closest('.scenario-carousel-component').find('.scenario-carousel-copy-carousel').carousel(Number(slideTo));
        });
    };

    // Loops all the Scenario Carousels on the page and checks if a particular carousel is visible on screen
    $('.scenario-carousel-component').each(function () {
        checkIfElementIsVisible($(this));
    });
});