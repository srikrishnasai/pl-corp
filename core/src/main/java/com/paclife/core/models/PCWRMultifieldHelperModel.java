package com.paclife.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = SlingHttpServletRequest.class)
public class PCWRMultifieldHelperModel {

	Logger logger = LoggerFactory.getLogger(PCWRMultifieldHelperModel.class);
	
	@Inject
	private String nodeName;
	
	@Inject
	public Resource resource;
	
	public Resource childResource;
	
	@PostConstruct
	protected void init() {
		
		if (nodeName != null) {
			childResource = resource.getChild(nodeName);
		} 

	}
}
