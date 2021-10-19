$(document).ready(function() {
	var checkIfElementIsVisible = function (elem) {
        var startAnimation = elem.hasClass('go');
        if (startAnimation) {
			setTimeout(function() {
				animateNumbers(elem);
			}, 1200);
        } else {
            setTimeout(function () {
                checkIfElementIsVisible(elem);
            });
        }
    };
	
	var animateNumbers = function(elem) {
		var authoredStartValue = elem.attr('data-animating-numbers-start-value');
		var authoredEndValue = elem.attr('data-animating-numbers-end-value');
		var $numbersElem = elem.find('.animating-numbers-number');
		var decimalsFixedLength = 0;
		var authoredStartValueDecLength;
		var incrementValueDecLength;
		var authoredEndValueDecLength;

		if($numbersElem.length > 0 && authoredStartValue && authoredEndValue && authoredStartValue.length > 0 && authoredEndValue.length > 0) {
			var authoredIncrementValue = elem.attr('data-animating-numbers-increment-value') || 1;
			var animationTime = parseFloat(elem.attr('data-animating-numbers-interval') || 20);

			authoredStartValueDecLength = authoredStartValue.indexOf('.') > 0 ? authoredStartValue.split('.')[1].length : 0; 
			authoredEndValueDecLength = authoredEndValue.indexOf('.') > 0 ? authoredEndValue.split('.')[1].length : 0; 
			incrementValueDecLength = authoredIncrementValue.indexOf('.') > 0 ? authoredIncrementValue.split('.')[1].length : 0;
			
			decimalsFixedLength = Math.max(authoredStartValueDecLength, incrementValueDecLength, authoredEndValueDecLength);

			var startValue = parseFloat(authoredStartValue);
			var endValue = parseFloat(authoredEndValue);
			var incrementValue = parseFloat(authoredIncrementValue);
			
			const timer = setInterval(function() {
				startValue += incrementValue;
				if(startValue > endValue) {
					startValue = endValue;
				}
				if(startValue !== endValue) {
					$numbersElem[0].innerText = parseFloat(startValue).toFixed(decimalsFixedLength);
				} else {
					$numbersElem[0].innerText = startValue;
				}
				
				if(startValue >= endValue) {
					clearInterval(timer);
				}
			}, animationTime);
		}
	};

	$('.animating-numbers').each(function() {
		if(window.innerWidth > 767) {
			checkIfElementIsVisible($(this));
		} else {
			var endValue = $(this).attr('data-animating-numbers-end-value');
			if(endValue) {
				$(this).find('.animating-numbers-number')[0].innerText = endValue;
			}
		}
	});

});