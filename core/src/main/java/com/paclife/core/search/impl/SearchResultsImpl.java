package com.paclife.core.search.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.inherit.ComponentInheritanceValueMap;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.paclife.core.search.SearchResult;
import com.paclife.core.search.SearchResults;
import com.paclife.core.search.SearchResultsPagination;
import com.paclife.core.search.predicates.PredicateResolver;
import com.paclife.core.search.predicates.impl.FullltextPredicateFactoryImpl;
import com.paclife.core.search.providers.SearchProvider;

@Model(adaptables = SlingHttpServletRequest.class, adapters = SearchResults.class, resourceType = "pcwr/components/structure/parts/search")
@Exporter(name = "jackson", selector = "results", extensions = "json", options = {
		@ExporterOption(name = "SerializationFeature.WRITE_NULL_MAP_VALUES", value = "true"),
		@ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false") })
public class SearchResultsImpl implements SearchResults {
	private static final Logger log = LoggerFactory.getLogger(SearchResultsImpl.class);

	@Self
	private SlingHttpServletRequest request;

	@OSGiService
	private PredicateResolver predicateResolver;

	@Inject
	private ResourceResolver resourceResolver;

	@Inject
	private SearchProvider searchProvider;

	private List<SearchResult> searchResults;

	private List<SearchResultsPagination> pagination;

	private long timeTaken = -1;

	private String totalResults;

	private com.day.cq.search.result.SearchResult result;

	@PostConstruct
	private void initModel() {
		final Map<String, String> searchPredicates = predicateResolver.getRequestPredicates(request);

		if (isSearchable()) {
			result = searchProvider.search(resourceResolver, searchPredicates);
			pagination = searchProvider.buildPagination(result, "Previous", "Next");
			searchResults = searchProvider.buildSearchResults(result);
			totalResults = computeTotalMatches(result);
			timeTaken = result.getExecutionTimeMillis();
		}
	}

	private boolean isSearchable() {
		return StringUtils.isNotBlank(getSearchTerm())
				|| new ComponentInheritanceValueMap(request.getResource()).getInherited("allowBlankFulltext", false);
	}

	private String computeTotalMatches(com.day.cq.search.result.SearchResult result) {
		String totalResult = String.valueOf(result.getTotalMatches());

		// Returning a String with '+' character in the case guessTotal is being used
		if (result.hasMore()) {
			totalResult += "+";
		}
		return totalResult;
	}

	@Override
	public List<SearchResult> getResults() {
		log.info("----- SearchResultsImpl getResults -----");
		return searchResults;
	}

	@JsonIgnore
	@Override
	public List<SearchResultsPagination> getPagination() {
		return pagination;
	}

	@Override
	public String getSearchTerm() {
		log.info("----- SearchResultsImpl getSearchTerm -----"
				+ request.getParameter(FullltextPredicateFactoryImpl.REQUEST_PARAM));
		return request.getParameter(FullltextPredicateFactoryImpl.REQUEST_PARAM);
	}

	@Override
	public long getTimeTaken() {
		return timeTaken;
	}

	@Override
	public String getResultTotal() {
		return totalResults;
	}

	public com.day.cq.search.result.SearchResult getResult() {
		return result;
	}
}
