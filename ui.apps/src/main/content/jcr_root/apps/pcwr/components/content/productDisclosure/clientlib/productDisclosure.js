$("li.state-dropdown-value").on("click", function () {
	var selected = this.getAttribute('data-value');
	
	$(".product-disclosure").each(function(i,o) {
		if(o.getAttribute('data-display-when') != 'always') {
			if(o.getAttribute('data-groups') != null &&
			   o.getAttribute('data-groups').indexOf(selected) > -1) {
				o.removeAttribute('hidden');
			}
			else {
				o.setAttribute('hidden','hidden');
			}
		}
	});
});
