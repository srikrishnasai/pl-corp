"use strict";
use(function() {
	var pageObj;

	if (this.pagePath && pageManager.getPage(this.pagePath)) {
		pageObj = pageManager.getPage(this.pagePath)
	}

	/*return {
		page : pageObj
	};*/
	
	return pageObj;
});