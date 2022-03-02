package com.paclife.core.search.providers;

import java.util.List;

import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.ResourceResolver;

import aQute.bnd.annotation.ProviderType;

@ProviderType
public interface SuggestionProvider {
	List<String> suggest(ResourceResolver resourceResolver, String[] paths, String nodeType, String term, int limit)
			throws RepositoryException;

	String[] getSearchPaths(ResourceResolver resourceResolver, String searchRootPagePath);

}
