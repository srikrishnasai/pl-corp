window.jQuery('span[name="more-menu-toggle"]').on('click', function (evt) {
	var input = evt.currentTarget;
	if (input.classList.contains('more-menu-toggle')) {
		//console.log('test123');
		$( "#more-menu" ).toggleClass("more-menu-show");
	}
});