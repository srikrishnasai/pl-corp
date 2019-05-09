package com.paclife.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.search.result.SearchResult;
import com.paclife.core.search.SearchResults;

@Model(adaptables = SlingHttpServletRequest.class)
public class PCWRSearchResultModel {

	Logger logger = LoggerFactory.getLogger(PCWRSearchResultModel.class);
	@Inject
	public SlingHttpServletRequest request;
	
	private long offsetValue = 0;
	private long rangeStart = 0;
	private long rangeEnd = 0;
	private long pageNumber = 0;

	@Inject
	Resource resource;
	
	@Inject
	@Optional
	private SearchResults searchResults;
	
	@Inject
	@Optional
	private String childNodeName;
	
	@PostConstruct
	protected void init() {
		if(searchResults != null) {
			
			SearchResult result = searchResults.getResult();
			offsetValue = result.getStartIndex();
			rangeStart = offsetValue + 1;

			long hitsPerPage = result.getHitsPerPage();
			rangeEnd = Math.min(rangeStart + hitsPerPage, result.getTotalMatches());
			pageNumber = 1 + offsetValue / hitsPerPage;			
		}		
	}

	public long getOffsetValue() {
		return offsetValue;
	}

	public long getRangeStart() {
		return rangeStart;
	}

	public long getRangeEnd() {
		return rangeEnd;
	}
	
	public ValueMap getChildProperties() {
		if(childNodeName != null && ! childNodeName.equals("")) {
			Resource childResource = resource.getChild(childNodeName);
			
			// Code Scan Remediation
			if(childResource == null) {
				return null;
			}
			
			return  childResource.adaptTo(ValueMap.class);
		}
		
		return ValueMap.EMPTY;
	}

	public long getPageNumber() {
		return pageNumber;
	}	
	
}
