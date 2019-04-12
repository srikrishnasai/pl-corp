"use strict";
use(function() {
	var path = granite.resource.properties["path"];
	var children = resource.getResourceResolver().resolve(path).listChildren();
	var filtered = [];
	/**
	 * Filter by PRODUCT TYPE only. The STATE filtering is done in the browser.
	 */
	for(var i=0; i < children.length; ++i) {
		var item = children[i];
		if(!item.path.endsWith("jcr:content") && pageManager.getPage(item.path)) {
			var page = pageManager.getPage(item.path);
			var jsArray = page.properties['productType'];
			var myArray = properties.get('productType');
			//
			// check if any element from myArray is in jsArray
			//
			outerLoop: for(var j=0; j < jsArray.length; ++j) {
				for(var k=0; k < myArray.length; ++k) {
					if(jsArray[j] == myArray[k]) {
						filtered.push(pageManager.getPage(item.path));
						break outerLoop;
					}
				}
			}
		}
	}
	return {
		filtered: filtered,
		states: resource.getResourceResolver().resolve("/etc/tags/pacific-life/product-states").listChildren()
	};
});