var Shuffle = window.Shuffle;
var adjustInsightsCardHeight = $('.insights-card-filter-item').matchHeight({ property: 'height' });

var myShuffle2 = new Shuffle(document.querySelector('.my-shuffled'), {
  itemSelector: '.insights-card-filter-item'
  //sizer: '.my-sizer-element',
  ,delimeter: ','  
  ,buffer: 1
  ,isCentered: true
});

//$('#insights-grid').css("display", "none");

/*
var mvmnt = 0;
myShuffle2.on(Shuffle.EventType.LAYOUT, function (data) {
    console.log('finished moving');
    mvmnt++;
    console.log('movement='+mvmnt);
});
*/


window.jQuery('span[name="shuffle-filter"]').on('click', function (evt) {
	var input = evt.currentTarget;
	if (input.classList.contains('nav-link')) {
		myShuffle2.filter(input.getAttribute("value"));
		adjustInsightsCardHeight;
	}
});
$(document).ready(function () {
    if( $('#randomize-cards').val() == "Yes" ){

        console.log('Randomize')
        
        function sortByBlockTitle(element){
            return element.getAttribute('data-media-block-title').toLowerCase();
        }
        
        var options = {
          randomize: true,
          by: sortByBlockTitle,
        };

        //console.log('My shuffle2: ', myShuffle2);
        myShuffle2.sort(options);
   
    } else {
        console.log("not randomized");
        myShuffle2;
    }
    
    setTimeout(function() {
        $('#insights-grid').css('left','0');
	}, 2000);
    
    
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


