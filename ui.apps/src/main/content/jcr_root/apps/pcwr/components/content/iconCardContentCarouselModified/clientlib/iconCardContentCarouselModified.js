$(document).ready(function () { 

	//Find all mod carousel
	var $allModCars = $(".mod.carousel");
	console.log($allModCars.length);
	
	$allModCars.each(function() {
		var $modCarsID = $(this).attr("id");
		console.log('ID='+$modCarsID);

		$("#"+$modCarsID+" .list-inline-item.cta-text-btn,"+"#"+$modCarsID+" .carousel-control-prev,"+"#"+$modCarsID+" .carousel-control-next").attr("data-target","#"+$modCarsID);

		var adjustIconCardHeightMod = $('#' + $modCarsID + ' .icon-card').matchHeight({ property: 'height' });
		adjustIconCardHeightMod;
	
		$('#' + $modCarsID).on('slide.bs.carousel', function (e) {
       
			var isMobile = $('#' + $modCarsID + ' .carousel-indicators').is(':visible');
			
			//Execute logic only in Desktop view
			if(! isMobile) {
				var $e = $(e.relatedTarget);
				var idx = $e.index();
				var itemsPerSlide = 3;
				var totalItems = $('#' + $modCarsID + ' .icon-card-carousel-item').length;
				console.log('Total items='+totalItems);
					
				if (idx >= totalItems-(itemsPerSlide-1)) {
					var it = itemsPerSlide - (totalItems - idx);
					for (var i=0; i<it; i++) {
						// append slides to end
						if (e.direction=="left") {
							$('#' + $modCarsID + ' .icon-card-carousel-item').eq(i).appendTo('#' + $modCarsID + ' .icon-card-carousel-inner');
						}
						else {
							$('#' + $modCarsID + ' .icon-card-carousel-item').eq(0).appendTo('#' + $modCarsID + ' .icon-card-carousel-inner');
						}
					}
				}
			}
		});
		
		var maxHeight = 0;
	
		$('#' + $modCarsID + ' .carousel-item').each(function(i,v) {
			maxHeight = Math.max(maxHeight, $(v).height());
		});
	
		$('#' + $modCarsID + ' .carousel-item').each(function(i,v) {
			$(v).height(maxHeight);
		});

	});

	var checkIfElementIsVisible = function (elem) {
        var isAnimationDone = elem.find('.go');
        if (isAnimationDone && isAnimationDone.length > 0) {
			var isCarousel = elem.attr('data-is-carousel');
			if(isCarousel && isCarousel === 'true') {
				elem.find('.icon-card-carousel').carousel();
			}
			setTimeout(function() {
				removeAnimationClasses(elem);
			}, 1000);
        } else {
            setTimeout(function () {
                checkIfElementIsVisible(elem);
            });
        }
    };
	
	var removeAnimationClasses = function(elem) {
		elem.find('.carousel .carousel-inner.icon-card-carousel-inner').removeClass('animated fadeInDownHalfVeryShort delay-500 go');
		elem.find('.carousel .carousel-inner.icon-card-carousel-inner').css('opacity', '1');
		elem.find('.carousel .mobile-dots').css('opacity', '1');
	};

	$('.icon-card-carousel-component').each(function() {
		var isAnimationsEnabled = $(this).hasClass('animations-enabled');
		if(isAnimationsEnabled) {
			checkIfElementIsVisible($(this));
		}
	});
});

