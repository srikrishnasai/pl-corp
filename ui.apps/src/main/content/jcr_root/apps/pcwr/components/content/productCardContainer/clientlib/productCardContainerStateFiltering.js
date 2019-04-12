if($("ul.state-drop-down-list").length) {
	
	var $noProductsMsg = $('#no-products-msg');
	
	/* ---State Selector dropdown logic ------------------------------------------ */
	$("ul.state-drop-down-list").on("click", ".init", function () {
	  $(this).closest("ul").children('li:not(.init)').toggle();
	});
	
	var allOptions = $("ul.state-drop-down-list").children('li:not(.init)');
	$("ul.state-drop-down-list").on("click", "li:not(.init)", function () {
	  allOptions.removeClass('selected');
	  $(this).addClass('selected');
	  
	  PacLife.Storage.setSessionData('productState', $(this).text());
	  
	  $("ul.state-drop-down-list").children('.init').html($(this).html());
	  allOptions.toggle();
	});
	/*$("#submit").click(function () {alert("The selected Value is " + $("ul.state-drop-down-list").find(".selected").data("value"));});*/
	
	/*---Product Card Filtering ------------------------------------------*/
	var Shuffle = window.Shuffle;
	//Shuffle.FILTER_ATTRIBUTE_KEY = 'product-state';
	//var element = document.querySelector('.my-shuffle-container');
	var element = document.getElementById('grid');
	//var sizer = element.querySelector('.sizer-element');
	var ie11Test = function (){ if(!!navigator.userAgent.match(/Trident.*rv\:11\./)){return false;} else{return true;}}
	var shuffleInstance = new Shuffle(element, {
		itemSelector: '.product-card'
	  //sizer: sizer, // could also be a selector: '.my-sizer-element'
	  //,sizer: '.product-card'
	  ,delimeter: ','
	  ,isCentered: true // Attempt to center grid items in each row.
	  ,group:'pacific-life:product-states/national'
	  //,buffer: 100 // Useful for percentage based heights when they might not always be exactly the same (in pixels).
	  //,initialSort: "pacific-life:product-states/national" // Shuffle can be initialized with a sort object. It is the same object given to the sort method.
	  //,columnWidth:360 // A static number or function that returns a number which tells the plugin how wide the columns are (in pixels).
	  //,columnThreshold: 0.01, // Reading the width of elements isn't precise enough and can cause columns to jump between values.
	  //,gutterWidth: 30 // A static number or function that tells the plugin how wide the gutters between columns are (in pixels)
	  //,throttle: throttle, // By default, shuffle will throttle resize events. This can be changed or removed.
	  //,throttleTime: 3000000000 // How often shuffle can be called on resize (in milliseconds).
	  ,useTransforms: ie11Test() // Whether to use transforms or absolute positioning.
	  //,roundTransforms: true // Whether to round pixel values used in translate(x, y). This usually avoids blurriness.
	  //,staggerAmount: 5000 // Transition delay offset for each item in milliseconds.
	  //,staggerAmountMax: 1500 // Maximum stagger delay in milliseconds.
	  //,filterMode: Shuffle.FilterMode.ANY // When using an array with filter(), the element passes the test if any of its groups are in the array. With "all", the element only passes if all groups are in the array.
	});
	
	$("li#showAllProductCards").on("click", function () {
	  shuffleInstance.filter();
	});
	var adjustHeight = $('.product-card').matchHeight({ property: 'height' });
	$("li.state-dropdown-value").on("click", function () {
		$noProductsMsg.addClass('d-none');
	  var filterValue = this.getAttribute('data-value');
	  //console.log(filterValue);
	  //console.log('useTransforms: ' +shuffleInstance.options.useTransforms);console.log('cotestbest: ' + ie11Test());
	  shuffleInstance.filter(filterValue);
	  setTimeout(checkIfNoProductsFound, 250);
	  adjustHeight;
	});
	
	/*PCWR-854: execute this function 250ms after shuffle.filter() as shuffle 
	instance is set to transition item height after 250ms (default value)*/
	function checkIfNoProductsFound() {
		if($('.productCardContainer #grid').height() == 0) {
			$noProductsMsg.removeClass('d-none');
		}
		else {
			$noProductsMsg.addClass('d-none');
		}
	}
	
	// PLCOM-362: Check if state selection is present in browser session.
        function checkSessionData() {
            var productStateFromSession = PacLife.Storage.getSessionData('productState');
        	if (productStateFromSession) {
        	    var listEl = $('li.state-dropdown-value:contains('+ productStateFromSession + ')')[0];
        	    if (listEl) {
        		$(listEl).trigger('click');
        		allOptions.toggle();
        	    }
        	}
	}
        
	$(document).ready(function () {
	  //shuffleInstance.filter('pacific-life:product-states/national');
	  //console.log(shuffleInstance);console.log('cotestbest: ' + ie11Test());
		shuffleInstance;
		
		checkSessionData();
	});
}