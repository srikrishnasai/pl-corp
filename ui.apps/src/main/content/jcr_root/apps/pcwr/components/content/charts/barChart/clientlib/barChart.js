$(document).ready(function () {

    // console.log("values",$('.bar-chart-bar').attr("data-bar-width"));

    var checkIfElementIsVisibleForChart = function (baseElement,elem) {
        var startAnimation = elem.hasClass('go');
        if (startAnimation) {
			setTimeout(function() {
				animateBar(elem,baseElement);
			}, 1200);
        } else {
            setTimeout(function () {
                checkIfElementIsVisibleForChart(baseElement,elem);
            });
        }
    };

    var animateBar = function(elem,baseElement){
        let tab_attribs = baseElement.find('.bar-chart-bar').map(function () {
            return $(this).attr("data-bar-width");
          });
          let increment = 0 ;
          let isAnimationDone = false;
          if(isAnimationDone === false){
            baseElement.find('.bar-chart-bar').each(function () {
                let value = Number(tab_attribs[increment]); 
                var $barWrapper = $(this).closest('.bar-chart-bar-inner-wrapper');
                if($barWrapper && $barWrapper.length > 0) {
                    var totalWidth = $barWrapper.width();
                    var labelWidth = $barWrapper.find('.bar-chart-bar-value').length > 0 ? $barWrapper.find('.bar-chart-bar-value').width() : 0; 
                    value = ((totalWidth - labelWidth - 10) * value) / 100;
                }
                $(this).animate({
                    width : value + "px"
                },{
                    duration: 1000,
                    easing: "linear"
                });
                increment++;
            });
            isAnimationDone = true;
        }
    }

    $('.bar-chart-component').each(function() {
		// if(window.innerWidth > 767) {
			checkIfElementIsVisibleForChart($(this), $(this).find('.bar-chart-title'));
		// } 
	});

    var removeAnimation = function(){
        let increment = 0 ;
        let tab_attribs = $('.bar-chart-component').find('.bar-chart-bar').map(function () {
            return $(this).attr("data-bar-width");
        });
        $('.bar-chart-component').find('.bar-chart-bar').each(function () {
            let value = Number(tab_attribs[increment]); 
            $(this).css('width',value+'%');
            increment++;
        });
    }
});

