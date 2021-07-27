"use strict";
use(function() {
	var filtered = [];
	var pathsArr = [];
	
	//Read the path to each of the 3 configured Insight Article pages
	pathsArr.push(properties.get("insightsCard1Path"));
	pathsArr.push(properties.get("insightsCard2Path"));
	pathsArr.push(properties.get("insightsCard3Path"));
	
	//For each path, if adaptable to Page --> add page object to filtered array
	
	for(var i=0; i < pathsArr.length; i++) {
		
		var path = pathsArr[i];
		
		if(path && pageManager.getPage(path)){
			filtered.push(pageManager.getPage(path));
		}
	}

	return {
		cards: filtered
	};
});