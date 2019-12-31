package com.paclife.core.search.providers.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;

import com.day.cq.search.facets.Facet;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.ResultPage;
import com.day.cq.search.result.SearchResult;
import com.google.common.collect.Lists;

/**
 * SearchResultProxy allows the Hits to be manipulated prior to result processing.
 * 
 * @author alex.ramos
 *
 */
public class SearchResultProxy { // implements SearchResult {

	final private SearchResult result;

	final private List<Hit> hits;

	final private int offset;

	final private int limit;

	public SearchResultProxy(SearchResult result, List<Hit> hits, int offset, int limit) {
		this.result = result;
		this.hits = hits;
		this.offset = offset;
		this.limit = limit;
	}

	public List<Hit> getHits() {
		int offsetLimit = Math.min(offset+limit, hits.size());
		return hits.subList(offset, offsetLimit);
	}

	public long getTotalMatches() {
		return hits.size();
	}

	public long getHitsPerPage() {
		return limit;
	}

	public String getExecutionTime() {
		return result.getExecutionTime();
	}

	public long getExecutionTimeMillis() {
		return result.getExecutionTimeMillis();
	}

	public Map<String, Facet> getFacets() throws RepositoryException {
		return result.getFacets();
	}

	public String getFilteringPredicates() {
		return result.getFilteringPredicates();
	}

	public ResultPage getNextPage() {
		if(offset + limit >= hits.size()) {
			return null;
        } else {
			return new ResultPage() {
				@Override
				public boolean isCurrentPage() {
					return false;
				}
				@Override
				public long getStart() {
					// Code Scan Remediation - Fix issue with incorrect return type being passed back
					int lResult = offset + limit;
					return new Long(lResult);
				}
				@Override
				public long getIndex() {
					// Code Scan Remediation - Fix issue with incorrect return type being passed back
					int lResult = offset/limit + 1;
					return new Long(lResult);
				}
			};
        }
	}

	public Iterator<Node> getNodes() {
		return getHits().stream().map(item -> {
			try {
				return item.getResource().getResourceResolver().adaptTo(Node.class);
			} catch (RepositoryException e) {
				// Code Scan Remediation
				// throw new RuntimeException(e);
				throw new IllegalArgumentException(e);
			}
		}).iterator();
	}

	public ResultPage getPreviousPage() {
		if(offset == 0) {
			return null;
        } else {
			return new ResultPage() {
				@Override
				public boolean isCurrentPage() {
					return false;
				}
				@Override
				public long getStart() {
					// Code Scan Remediation - Fix issue with incorrect return type being passed back
					int lResult = offset - limit;
					return new Long(lResult);
				}
				@Override
				public long getIndex() {
					// Code Scan Remediation - Fix issue with incorrect return type being passed back
					int lResult = offset/limit - 1;
					return new Long(lResult);
				}
			};
        }
	}

	public String getQueryStatement() {
		return result.getQueryStatement();
	}

	public Iterator<Resource> getResources() {
		return getHits().stream().map(t -> {
			try {
				return t.getResource();
			} catch (RepositoryException e) {
				// Code Scan Remediation
				// throw new RuntimeException(e);
				throw new IllegalArgumentException(e);
			}
		}).iterator();
	}

	public List<ResultPage> getResultPages() {
		int size = Lists.partition(hits, limit).size();
		List<ResultPage> pages = new ArrayList<>(size);
		for(int i=0; i < size; ++i) {
			final int index = i; 
			pages.add(new ResultPage() {
				@Override
				public long getIndex() {
					// Code Scan Remediation - Fix issue with incorrect return type being passed back
					return new Long(index);
				}
				@Override
				public long getStart() {
					// Code Scan Remediation - Fix issue with incorrect return type being passed back
					int lResult = index * limit;
					return new Long(lResult);
				}
				@Override
				public boolean isCurrentPage() {
					return offset == getStart();
				}
			});
		}
		return pages;
	}

	public long getStartIndex() {
		return offset;
	}

	public boolean hasMore() {
		// Returns whether there are more matches than given by getTotalMatches().
		// This is related to "guess total" feature.
		return result.hasMore();
	}
	
}
