if (typeof PacLife === "undefined") {
    var PacLife = {}
}

$(document).ready(function() {

	
	document.title = document.title + ' | Pacific Life ';

    // PLCOM-142: Logic to append .html & open Alt Fifty link in new tab
    $('.alt-fifty-link').each(function(index, element) {
		var target = $(element).attr('href');
	
		//Append html only if below criteria satisfied
		if (target && !target.includes('.pdf') && !target.includes('.com') && !target.includes('.org') && !target.includes('.html')) {
		    var newTarget = target + '.html';
		    $(element).attr('href', newTarget);
		}
    });

    // PLCOM-249
	$("#searchNavCollapse").on('shown.bs.collapse', function () {
	    $('#inputSearchValue').focus();
	});
    
	$(".touch-enabled-carousel").on("touchstart", function(event){
		var xClick = event.originalEvent.touches[0].pageX;
		$(this).one("touchmove", function(event){
			var xMove = event.originalEvent.touches[0].pageX;
			if( Math.floor(xClick - xMove) > 5 ){
				$(this).carousel('next');
			}
			else if( Math.floor(xClick - xMove) < -5 ){
				$(this).carousel('prev');
			}
		});
		$(".touch-enabled-carousel").on("touchend", function(){
			$(this).off("touchmove");
		});
	});
	
});

//PLCOM-359

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
