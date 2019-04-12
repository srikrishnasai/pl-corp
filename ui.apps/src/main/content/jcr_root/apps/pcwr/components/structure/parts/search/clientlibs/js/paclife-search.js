$(function() {
	
	$('.page-link').click(function(e) {
		e.preventDefault();
		var $form = $('#pl-search-form');
		var input= $("<input>").attr("type", "hidden").attr("name", "offset").val($(this).data('offsetValue'));
		$form.append($(input));
		$form.submit();
	});
	
	$('#pl-search-form').submit(function(e) {
	   // e.preventDefault();
	});
	
	$.each($('.pl-search-result-link'), function() {
		$(this).text(location.origin + $(this).text());
	});
});
