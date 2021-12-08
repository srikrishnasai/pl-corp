use(function() {
	var text = properties.quoteText || "";
	var words = properties.nonbreak || "";
	if(text) {
		words.split(/,/).forEach(function(word) {
			text = text.replace(word, word.replace(/ /g, "&nbsp;")); 
		});
	}
	return text;
});