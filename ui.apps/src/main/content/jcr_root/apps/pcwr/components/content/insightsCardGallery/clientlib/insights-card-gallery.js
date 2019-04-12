var Shuffle = window.Shuffle;
var adjustInsightsCardHeight = $('.insights-card-filter-item').matchHeight({ property: 'height' });

var myShuffle2 = new Shuffle(document.querySelector('.my-shuffled'), {
  itemSelector: '.insights-card-filter-item'
  //sizer: '.my-sizer-element',
  ,delimeter: ','  
  ,buffer: 1
  ,isCentered: true
});

window.jQuery('span[name="shuffle-filter"]').on('click', function (evt) {
	var input = evt.currentTarget;
	if (input.classList.contains('nav-link')) {
		myShuffle2.filter(input.getAttribute("value"));
		adjustInsightsCardHeight;
	}
});
$(document).ready(function () {
	
	$('span[name="shuffle-filter"]').click(function () {
		
		setTimeout(function() {
			$(".insights-gallery-container-wrapper").animate( { height: $('#insights-grid').height() }, { queue:false, duration:500 });
			$('.insights-gallery-view-more-btn').hide();
		}, 250); 
	});

	myShuffle2;
	
	/* Start: If URL has filter, trigger click*/
	var selectInsight = $('#url-insight-value').val();
	if(selectInsight) {
		$('#'+selectInsight).trigger('click');
	}
	/* End*/
	
	var incHeight;
	findIncHeight();
	var initialInsightsGridHeight = $('#insights-grid').height();
	
	if(initialInsightsGridHeight > incHeight){
		$('.insights-gallery-container-wrapper').css('height', incHeight*2);
		
		viewMoreBtnDisplayCond(initialInsightsGridHeight, $('.insights-gallery-container-wrapper').height());
	}
	
	$('.insights-gallery-view-more-btn').click(function () {
		
		var insightsGridHeight = $('#insights-grid').height();
		var currWrapperHt = $(".insights-gallery-container-wrapper").height();
		var newWrapperHt = currWrapperHt + incHeight;
	
		$(".insights-gallery-container-wrapper").animate( { height: newWrapperHt+'px' }, { queue:false, duration:500 });
		viewMoreBtnDisplayCond(insightsGridHeight, newWrapperHt);
		
	});

	function viewMoreBtnDisplayCond(gridHt, wrapperHt) {
		
		// Math.round() call is IE11 fix
		if(Math.round(gridHt) - Math.round(wrapperHt) >= incHeight) {
			$('.insights-gallery-view-more-btn').show();
		}
		else {
			$('.insights-gallery-view-more-btn').hide();
		}
	}
	
	/* When Screen width > 576, the card height is 554 else card height is 538
	  Based on CSS*/
	function findIncHeight() {
		
		if($(window).width() > 576) {
			incHeight = 554
		}
		else {
			incHeight = 538;
		}
	}
	
	/*$(window).resize(function() {
		findIncHeight();
	})*/
});


