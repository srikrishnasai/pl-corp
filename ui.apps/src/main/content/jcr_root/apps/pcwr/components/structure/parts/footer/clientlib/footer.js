$(document).ready(function(){
	var year = (new Date()).getFullYear();
	var str = $('.footer-copyright-text').text();
	$('.footer-copyright-text').text(str.replace('Copyright', 'Copyright '+year));
});