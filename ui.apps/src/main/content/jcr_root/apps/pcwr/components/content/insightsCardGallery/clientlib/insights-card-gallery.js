var Shuffle = window.Shuffle;
var adjustInsightsCardHeight = $('.insights-card-filter-item').matchHeight({ property: 'height' });
var gridItems = $('.insights-card');

var showItemsInViewport = function (changes) {
	changes.forEach(function (change) {
		if (change.isIntersecting) {
			change.target.classList.add('in');
		}
	});
};
  
  /**
   * Only the items out of the viewport should transition. This way, the first
   * visible ones will snap into place.
   */
var addTransitionToItems = function () {
	for (var i = 0; i < this.gridItems.length; i++) {
		var inner = this.gridItems[i].querySelector('.insights-card-wrapper__inner');
			
		if($(this.gridItems[i]).offset().top > $(window).scrollTop()) {
			inner.classList.add('insights-card-wrapper__inner--transition');
		} 
	}
};

if(window.IntersectionObserver) {
	var callback = this.showItemsInViewport.bind(this);
	this.observer = new window.IntersectionObserver(callback, {
		threshold: 0.3,
	});

	// Loop through each grid item and add it to the viewport watcher.
	for (var i = 0; i < this.gridItems.length; i++) {
		this.observer.observe(this.gridItems[i]);
	}
}

var myShuffle2 = new Shuffle(document.querySelector('.my-shuffled'), {
  itemSelector: '.insights-card-filter-item'
  //sizer: '.my-sizer-element',
  ,delimeter: ','  
  ,buffer: 1
  ,isCentered: true,
  speed: 0
});

var mvmnt = 0;
myShuffle2.on(Shuffle.EventType.LAYOUT, function (data) {
	// Add the transition class to the items after ones that are in the viewport
	// have received the `in` class.
	setTimeout(function () {
		this.addTransitionToItems();
	}.bind(this), 100);
	
    console.log('finished moving');
    /*
    mvmnt++;
    console.log('movement='+mvmnt);

    if(mvmnt>=1){
       console.log('Movement >= 1');    
       $('#insights-grid').css('left','0');
     }
	*/
});

window.jQuery('span[name="shuffle-filter"]').on('click', function (evt) {
	var input = evt.currentTarget;
	if (input.classList.contains('nav-link')) {
		$('.insights-card').each(function() {
			$(this).removeClass('in');
			$(this).find('.insights-card-wrapper__inner').css({'opacity': '1', 'transform': 'none'});
			$(this).find('.insights-card-wrapper__inner').removeClass('insights-card-wrapper__inner--transition');
		});

		myShuffle2.filter(input.getAttribute("value"));
		adjustInsightsCardHeight;
	}
});

$(document).ready(function () {
	
    if( $('#randomize-cards').val() == "Yes" ){
        //mvmnt++;
        console.log('Randomize '+mvmnt);

        function sortByBlockTitle(element){
            return element.getAttribute('data-media-block-title').toLowerCase();
        }
        
        var options = {
          randomize: true,
          by: sortByBlockTitle,
        };

        myShuffle2.sort(options);
    } else {
        console.log("not randomized");
        myShuffle2;
        $('#insights-grid').css('left','0');
    }
    
    /*
    setTimeout(function() {
        $('#insights-grid').css('left','0');
	}, 1200);
    */
    
	$('span[name="shuffle-filter"]').click(function () {
		setTimeout(function() {
			$(".insights-gallery-container-wrapper").animate( { height: $('#insights-grid').height() }, { queue:false, duration:500 });
			$('.insights-gallery-view-more-btn').hide();
		}, 250); 
	});

	
	/* Start: If URL has filter, trigger click*/
	var selectInsight = $('#url-insight-value').val();
	if(selectInsight) {
		$('#'+selectInsight).trigger('click');
	}
	/* End*/
	
	var incHeight;
	findIncHeight();
	var initialInsightsGridHeight = $('#insights-grid').height();
    var rowNum = $('.insights-gallery-container-wrapper').attr('data-row');
    //var cardsNum = $('.card.insights-card').length;
    //console.log('cardsNum='+cardsNum);
    
    if(rowNum == 99){
      $('.insights-gallery-container-wrapper').css('height', initialInsightsGridHeight)
      viewMoreBtnDisplayCond(initialInsightsGridHeight, $('.insights-gallery-container-wrapper').height());
    }
	else if(initialInsightsGridHeight > incHeight){
        
		$('.insights-gallery-container-wrapper').css('height', incHeight*rowNum); //sets height to number of rows
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
