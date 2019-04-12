package com.paclife.core.search;

import aQute.bnd.annotation.ProviderType;

import java.util.List;

@ProviderType
public interface SearchResults {
    List<SearchResult> getResults();

    List<SearchResultsPagination> getPagination();

    String getSearchTerm();

    long getTimeTaken();
    
    String getResultTotal();
    
    com.day.cq.search.result.SearchResult getResult();
}
