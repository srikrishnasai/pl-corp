window.jQuery('span[name="more-menu-toggle"]').on('click', function (evt) {
	var input = evt.currentTarget;
	if (input.classList.contains('more-menu-toggle')) {
		//console.log('test123');
		$( "#more-menu" ).toggleClass("more-menu-show");
	}
});


$('.more-menu-toggle').click(function(e) {    
	var showClassExist = $('#more-menu').hasClass('more-menu-show'); 
	console.log(showClassExist)        
	if(showClassExist){  
		$("#more-menu").removeClass('silde-out-animation');  
		
		console.log("Added");
	}
	else{
		
		$("#more-menu").addClass('silde-out-animation');
		console.log("Removed");
	}
}); 