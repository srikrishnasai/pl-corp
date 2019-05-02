package com.paclife.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;

@Model(adaptables = SlingHttpServletRequest.class)
public class PCWRTagHelperModel {

	Logger logger = LoggerFactory.getLogger(PCWRTagHelperModel.class);
	@Inject
	@Optional
	private String tagString;

	@Inject
	public Resource resource;

	private Tag tag;

	@PostConstruct
	protected void init() {
		TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);

		// Code Scan Remediation
		if (tagString != null && tagManager != null) {
			tag = tagManager.resolve(tagString);
		} 

	}

	public Tag getTag() {
		return tag;
	}

}
