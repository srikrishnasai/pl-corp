"use strict";
use(function() {
	var filtered = [];
	var path = properties.get("path");
	

	if (path) {		
		var children = resource.getResourceResolver().resolve(path).listChildren();		
		for(var i=0; i < children.length; ++i) {
			var item = children[i];
			if(!item.path.endsWith("jcr:content") && pageManager.getPage(item.path)) {
				filtered.push(pageManager.getPage(item.path));
			}
		}
	}

	return {
		cards: filtered
	};
});