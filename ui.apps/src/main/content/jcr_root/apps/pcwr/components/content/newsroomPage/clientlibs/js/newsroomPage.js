$(function() {
	
	$('.newsroom-page-wrapper .dropdown-toggle').click(function() {
		event.preventDefault();
	});
	
	$('.newsroom-page-wrapper .dropdown-menu a').click(function(event) {
		event.preventDefault();
		$('.newsroom-page-wrapper .dropdown-toggle').html($(this).html());
		
		var year = $(this).data('year');
		
		
		$('.news-item[data-year = ' + year + ']').show();
		$('.news-item[data-year != ' + year + ']').hide();
	});
	
	$('.newsroom-page-wrapper .dropdown-menu a').first().trigger('click');
	
});
