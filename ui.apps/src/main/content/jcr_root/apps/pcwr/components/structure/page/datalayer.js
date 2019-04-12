"use strict";

var SlingSettingsService = Packages.org.apache.sling.settings.SlingSettingsService;

use(function () {

    // Return if user is in Template Editor
    if(currentPage.path.startsWith("/conf")) {
        return;
    }

    var pageTitle = currentPage.title;
    var pageName = "";
    var pagePath = currentPage.path;
    var resourceType = currentPage.properties.get("sling:resourceType");
    var template = currentPage.properties.get("cq:template");
    var pageTags = currentPage.properties.get("cq:tags");
    var language = request.locale.language;
    
    var hierarchy1 = "", hierarchy2 = "", hierarchy3 = "", hierarchy4 = "";
        
    var parentPage = currentPage.getParent();
    var reversePageStruct = [];
    while (parentPage != null && parentPage.getName() != "pcwr") {
        reversePageStruct.push(''+parentPage.getTitle());
        parentPage=parentPage.getParent();
    }

    reversePageStruct.reverse().splice(4);
    
    var pageHierarchy = [];
    for (var j=0; j<reversePageStruct.length; j++) {
        pageHierarchy.push(titleCase(''+reversePageStruct[j]));
    }
    
    if (pageHierarchy[0]) hierarchy1 = pageHierarchy[0];
    if (pageHierarchy[1]) hierarchy2 = pageHierarchy[1];
    if (pageHierarchy[2]) hierarchy3 = pageHierarchy[2];
    if (pageHierarchy[3]) hierarchy4 = pageHierarchy[3];
    
    var returnTags = [];
    if (pageTags) {
	    for (var i=0; i<pageTags.length; i++) {
			var tag = pageTags[i];
	        returnTags.push(tag);
	    }
    }
    

    if (pageHierarchy.length > 0) {
    	pageName = pageHierarchy.join(':') + ':' + titleCase(pageTitle);
    } else {
    	pageName = titleCase(pageTitle);
    }
    
    var runmodesArr = [];
    var runmodesSet = sling.getService(SlingSettingsService).getRunModes();
    var iterator = runmodesSet.iterator();
    while (iterator.hasNext()) {
        runmodesArr.push(iterator.next());
    }

    return {
        pageTitle: titleCase(pageTitle),
        pageName: pageName,
        pagePath: pagePath,
        pageType: String(resourceType).replace(/^.*\//, ""),
        pageTemplate: String(template).replace(/^.*\//, ""),
        hierarchy1: hierarchy1,
        hierarchy2: hierarchy2,
        hierarchy3: hierarchy3,
        hierarchy4: hierarchy4,
        environment: runmodesArr,
        language: language,
        tags: returnTags
    };
});

function titleCase(titleStr) {
    var splitStr = titleStr.replace('-', ' ').replace('   ', ' ').replace('  ',' ').toLowerCase().split(' ');
    for (var i=0; i<splitStr.length; i++) {
		splitStr[i] = splitStr[i].substr(0,1).toUpperCase() + splitStr[i].substring(1);
    }
    var formattedStr = splitStr.join(' ').replace(/[^\w]/gi, '');
    return formattedStr;
}
