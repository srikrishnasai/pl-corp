package com.paclife.core.models;

import javax.inject.Inject;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;

@Model(adaptables = SlingHttpServletRequest.class)
public class PCWRUtilModel {

	Logger logger = LoggerFactory.getLogger(PCWRUtilModel.class);
	
	@Inject
	@Optional
	private String resourceLink = null;
	
	@Inject
	private Page currentPage = null;
	
	public String getFormattedLink() {
		
		if(resourceLink != null && ! resourceLink.equals("")) {
			
			if(StringUtils.containsIgnoreCase(resourceLink, "/content/dam"))
			{
				logger.info("Product card resource lInks" + resourceLink);
				return resourceLink;
			}
			else {
				logger.info("Product card resource lInks" + resourceLink);
				return resourceLink + ".html";
			}
			

		}
		return StringUtils.EMPTY;
	}
	
	public String getHomePagePath() {
		return currentPage.getAbsoluteParent(1).getPath() + "/home.html";
		
	}
}
