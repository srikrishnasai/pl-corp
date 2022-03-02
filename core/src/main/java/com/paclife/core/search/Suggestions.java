package com.paclife.core.search;

import java.util.List;

import aQute.bnd.annotation.ProviderType;

@ProviderType
public interface Suggestions {

	List<String> getSuggestions();

	String getSearchTerm();

	long getTimeTaken();
}
