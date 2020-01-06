package com.paclife.core.search.providers;

import aQute.bnd.annotation.ProviderType;
import com.paclife.core.search.SearchResultsPagination;
import org.apache.sling.api.resource.ResourceResolver;

import com.day.cq.search.result.SearchResult;

import java.util.List;
import java.util.Map;

@ProviderType
public interface SearchProvider {
	SearchResult search(ResourceResolver resourceResolver, Map<String, String> predicates);

	List<SearchResultsPagination> buildPagination(SearchResult result, String previousLabel, String nextLabel);

    List<com.paclife.core.search.SearchResult> buildSearchResults(SearchResult result);
}
