$(document).ready(function() {

	$('.nav-pills > a').hover(function() {
		$(this).tab('show');

	});
	
	$('a[href^="#v-pills"]').click(function(){
		location.href=$(this).data('link');
	});
});