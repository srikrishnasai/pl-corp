package com.paclife.core.util;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.NameConstants;

public class LinkFixer extends WCMUsePojo {
	
	private String fixedLink;
	
	@Override
	public void activate() throws Exception {
		
		String originalLink = this.get("link", String.class);
		
		if(originalLink == null) {
			fixedLink = null;
			return;
		}
		
		ResourceResolver resourceResolver = this.getResourceResolver();
		Resource page = resourceResolver.resolve(originalLink);

		if(page == null) {
			// this will be the case for external links
			fixedLink = originalLink;
		}
		else if(page.getResourceType().equals(NameConstants.NT_PAGE)) {
			// page link
			fixedLink = resourceResolver.map(getRequest(), originalLink) + ".html";
		}
		else {
			// DAM asset
			fixedLink = resourceResolver.map(getRequest(), originalLink);
		}
	}

	public String getValue() {
		return fixedLink;
	}

}
