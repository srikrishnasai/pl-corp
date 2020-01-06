package com.paclife.core.search.providers.impl;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

// Felix Imports
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Service;
import org.osgi.service.metatype.annotations.Reference;*/

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.Predicate;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.ResultPage;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.NameConstants;
import com.paclife.core.search.SearchResultsPagination;
import com.paclife.core.search.impl.SearchResultsPaginationImpl;
import com.paclife.core.search.providers.SearchProvider;

//OSGI Annotation Declaration R7 Format
/* @Component(service={}) */

@Component
@Service
public class SearchProviderImpl implements SearchProvider {
	
    private static final Logger log = LoggerFactory.getLogger(SearchProviderImpl.class);
    
    private final Pattern ALLOWED_ASSETS = Pattern.compile("^.*\\.pdf$", Pattern.CASE_INSENSITIVE);

    @Reference
    private QueryBuilder queryBuilder;

    @Reference
    private ModelFactory modelFactory;

    public SearchResultProxy search(ResourceResolver resourceResolver, Map<String, String> predicates) {
    	try {
			// limit and offset have to be handled here, because of component results collapsing onto pages throws it off
			int limit = Integer.parseInt(predicates.remove("p.limit"));
			int offset = Integer.parseInt(predicates.remove("p.offset"));
			
			predicates.put("p.limit", String.valueOf(Integer.MAX_VALUE)); // important
			
			PredicateGroup outer = rewritePathPredicate(predicates);
			
			log.info("Search query: " + outer.toString());
			
			final Query query = queryBuilder.createQuery(outer, resourceResolver.adaptTo(Session.class));
			
			SearchResult result = query.getResult();
			List<Hit> consolidatedHits = consolidate(result.getHits());
			
			SearchResultProxy searchResultProxy = new SearchResultProxy(result, consolidatedHits, offset, limit);
			return searchResultProxy;
		} catch (RepositoryException e) {
			// Code Scan Remediation
			// throw new RuntimeException(e);
			throw new IllegalArgumentException(e);
		}
    }

	private List<Hit> consolidate(List<Hit> hits) throws RepositoryException {
		List<Hit> consolidatedHits = new ArrayList<>();
		Map<String,Hit> pages = new HashMap<>();
		
		for(Hit hit: hits) {        
			checkHit(consolidatedHits, pages, hit);
		}
		return consolidatedHits;
	}

	private void checkHit(List<Hit> consolidatedHits, Map<String, Hit> pages, Hit hit) throws RepositoryException {

		Resource container = getContainer(hit);
		if(container != null && !pages.containsKey(container.getPath())) {
			
			// scenario#1: normal page
			if(hit.getResource().getResourceType().equals(NameConstants.NT_PAGE)) {
				pages.put(container.getPath(), hit);
				consolidatedHits.add(hit);
			}
			// scenario#2: normal asset or nodes inside asset
			else if(container.getResourceType().equals(DamConstants.NT_DAM_ASSET)) {
				if(ALLOWED_ASSETS.matcher(hit.getPath()).matches()) {
					pages.put(container.getPath(), hit);
					consolidatedHits.add(hit);
				}
			}
			// scenario#3: component node inside of a page
			else {
				
				// construct a Hit that looks like it hit the page, not the component:
				Hit pageHit = new PageHit(hit, container);
				
				consolidatedHits.add(pageHit);
				
				// take only the first hit, ignore the rest on same page
				pages.put(container.getPath(), pageHit);
			}
		}
	}

	private Resource getContainer(Hit hit) throws RepositoryException {
		Resource res = hit.getResource();
		while(res != null &&
			 !res.getResourceType().equals(NameConstants.NT_PAGE) && 
			 !res.getResourceType().equals(DamConstants.NT_DAM_ASSET)) {

			res = res.getParent();
		}
		return res;
	}

	private PredicateGroup rewritePathPredicate(Map<String, String> predicates) {
		// split the path predicate into a sub-predicate
    	String paths = predicates.remove("path");
    	
        PredicateGroup outer = PredicateGroup.create(predicates);
        PredicateGroup inner = new PredicateGroup();
    	
    	for(String path: paths.split(",")) {
    		inner.add(new Predicate("path").set("path", path));
    	}
    	inner.setAllRequired(false);
    	outer.add(inner);
		return outer;
	}

    @Override
    public final List<com.paclife.core.search.SearchResult> buildSearchResults(com.day.cq.search.result.SearchResult result) {
        final List<com.paclife.core.search.SearchResult> searchResults = new ArrayList<com.paclife.core.search.SearchResult>();

        for (Hit hit : result.getHits()) {
            try {
                final com.paclife.core.search.SearchResult searchResult = modelFactory.createModel(hit.getResource(), com.paclife.core.search.SearchResult.class);
                
                // Augment the Search Result model with attributes that cannot be obtained directly from the resource
                List<String> excerpts = new ArrayList<String>();
                excerpts.add(hit.getExcerpt());
                searchResult.setExcerpts(excerpts);

                searchResults.add(searchResult);
                log.debug("Added hit [ {} ] to search results", hit.getPath());
			// Code Scan Remediation - Exception for list .add()
			} catch(java.lang.UnsupportedOperationException e) {
				log.warn("Unable to adapt this hit's resource to a Search Result", e);
            } catch (Exception e) {
                log.warn("Unable to adapt this hit's resource to a Search Result", e);
            }
        }
        return searchResults;
    }

    @Override
    public final List<SearchResultsPagination> buildPagination(com.day.cq.search.result.SearchResult result, String previousLabel, String nextLabel) {
        final List<SearchResultsPagination> pagination = new ArrayList<SearchResultsPagination>();
        long hitNum = result.getHitsPerPage();

        // Populate the Previous page
        ResultPage previousPageResult = result.getPreviousPage();
        if (previousPageResult != null) {
            SearchResultsPaginationImpl previousPage = new SearchResultsPaginationImpl(previousPageResult.getStart(), previousLabel, previousPageResult.isCurrentPage(), previousPageResult.isCurrentPage());
            pagination.add(previousPage);
        }

        // Populate the numbered pages
        for (ResultPage page : result.getResultPages()) {
            SearchResultsPaginationImpl currOption = new SearchResultsPaginationImpl(page.getStart(),
                    String.valueOf((page.getStart() / hitNum) + 1), page.isCurrentPage(), page.isCurrentPage());
            pagination.add(currOption);
        }

        // Populate the Next page
        ResultPage nextPageResult = result.getNextPage();
        if (nextPageResult != null) {
            SearchResultsPaginationImpl nextPage = new SearchResultsPaginationImpl(nextPageResult.getStart(), nextLabel, nextPageResult.isCurrentPage(), nextPageResult.isCurrentPage());
            pagination.add(nextPage);
        }

        return pagination;
    }
}
