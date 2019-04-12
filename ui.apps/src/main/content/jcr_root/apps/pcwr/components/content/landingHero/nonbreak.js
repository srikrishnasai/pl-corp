use(function() {
	var text = properties.landingHeroHeading;
	var words = properties.nonbreak || 'Life Goals,Pacific Life';
	if(text) {
		words.split(/,/).forEach(function(word) {
			text = text.replace(word, word.replace(" ", "&nbsp;")); 
		});
	}
	return text;
});