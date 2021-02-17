var adjustIconCardHeight = $('.icon-card').matchHeight({ property: 'height' });
adjustIconCardHeight;
$(document).ready(function () { 
	var compID = $('.carousel.slide').attr('id')
    $('#' + compID).on('slide.bs.carousel', function (e) {
       
		var isMobile = $('#iconCardContentCarousel .carousel-indicators').is(':visible');
		
		//Execute logic only in Desktop view
		if(! isMobile) {
		    var $e = $(e.relatedTarget);
		    var idx = $e.index();
		    var itemsPerSlide = 3;
		    var totalItems = $('.icon-card-carousel-item').length;
		        
		    if (idx >= totalItems-(itemsPerSlide-1)) {
		        var it = itemsPerSlide - (totalItems - idx);
		        for (var i=0; i<it; i++) {
		            // append slides to end
		            if (e.direction=="left") {
		                $('#iconCardContentCarousel .icon-card-carousel-item').eq(i).appendTo('.icon-card-carousel-inner');
		            }
		            else {
		                $('#iconCardContentCarousel .icon-card-carousel-item').eq(0).appendTo('.icon-card-carousel-inner');
		            }
		        }
		    }
		}
    });
    
    var maxHeight = 0;

    $('#iconCardContentCarousel .carousel-item').each(function(i,v) {
    	maxHeight = Math.max(maxHeight, $(v).height());
    });

    $('#iconCardContentCarousel .carousel-item').each(function(i,v) {
    	$(v).height(maxHeight);
    });

});

