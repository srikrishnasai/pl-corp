$(function() {
	
	$('.newsroom-page-wrapper .dropdown-toggle').click(function() {
		event.preventDefault();
	});
	
	$('.newsroom-page-wrapper .dropdown-menu a').click(function(event) {
		event.preventDefault();
		$('.newsroom-page-wrapper .dropdown-toggle').html($(this).html());
		
		var nrYear = window.localStorage.getItem('newsRoomYear');
		var year = $(this).data('year');
		
		PacLife.Storage.setSessionData('newsRoomYear', year);
		
		$('.news-item[data-year = ' + year + ']').show();
		$('.news-item[data-year != ' + year + ']').hide();
	});
	
	var nrYear = PacLife.Storage.getSessionData('newsRoomYear');
	
	if(nrYear) {
		$('.newsroom-page-wrapper .dropdown-toggle').html($("a[data-year='" + nrYear + "']").html());
		
		$('.news-item[data-year = ' + nrYear + ']').show();
		$('.news-item[data-year != ' + nrYear + ']').hide();
	} else {
		$('.newsroom-page-wrapper .dropdown-menu a').first().trigger('click');
	}
	
});
