package com.paclife.core.search.providers.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.jcr.query.Row;
import javax.jcr.query.RowIterator;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.eval.JcrPropertyPredicateEvaluator;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.NameConstants;
import com.paclife.core.search.predicates.impl.PathsPredicateFactoryImpl;
import com.paclife.core.search.providers.SuggestionProvider;

@Component
@Service
public class SuggestionProviderImpl implements SuggestionProvider {

	public static final String SEARCHPATH_PROPERTY_NAME = "searchingPaths";
	private static final String CORP_SUGGEST_LUCENE_INDEX = "cqPageLuceneCorpSuggest";
	private static final Logger log = LoggerFactory.getLogger(SuggestionProviderImpl.class);

	@Reference
	private QueryBuilder queryBuilder;

	@Override
	public List<String> suggest(ResourceResolver resourceResolver, String[] paths, String nodeType, String term,
			int limit) throws RepositoryException {
		final Set<String> suggestionsKeys = new HashSet<String>();
		final List<String> suggestions = new ArrayList<String>();

		if (StringUtils.isBlank(term)) {
			return suggestions;
		}

		for (String p : paths) {
			nodeType = StringUtils.defaultIfEmpty(getNodeTypeforPath(p), JcrConstants.NT_HIERARCHYNODE);
			if (nodeType.equalsIgnoreCase(NameConstants.NT_PAGE)) {
				final String statement = String.format(
						"SELECT [rep:suggest()] FROM [%s] WHERE SUGGEST('%s') AND ISDESCENDANTNODE('%s') OPTION(INDEX NAME [%s])",
						escape(nodeType), escape(term), escape(p), CORP_SUGGEST_LUCENE_INDEX);
				final QueryManager queryManager = resourceResolver.adaptTo(Session.class).getWorkspace()
						.getQueryManager();
				final QueryResult result = queryManager.createQuery(statement, javax.jcr.query.Query.JCR_SQL2)
						.execute();
				final RowIterator rows = result.getRows();

				int count = 0;
				while (rows.hasNext()) {
					final Row row = rows.nextRow();

					String suggestion = row.getValue("rep:suggest()").getString();
					String key = getUniqueSuggestionKey(suggestion);

					if (suggestionsKeys.contains(key)) {
						continue;
					}

					suggestionsKeys.add(key);
					suggestions.add(StringUtils.lowerCase(suggestion));

					if (limit > 0 && ++count >= limit) {
						break;
					}

				}
				log.info("Statement ::{} and its result ::{}", statement, suggestions);
			}
		}

		return (!suggestions.isEmpty() && suggestions.size() > limit) ? suggestions.subList(0, limit) : suggestions;

	}

	private String getNodeTypeforPath(String p) {
		if (StringUtils.startsWith(p, PathsPredicateFactoryImpl.ALLOWED_DAM_ROOT)) {
			return DamConstants.NT_DAM_ASSET;
		}
		return NameConstants.NT_PAGE;
	}

	private String escape(String str) {
		return StringUtils.stripToEmpty(str).replaceAll("'", "''");
	}

	/**
	 * This create a key to help normalize and de-dupe results. - turns to lowercase
	 * - turns all ' ' to - - reduces all multiple - segments into a single - (ex.
	 * --- becomes -) *
	 *
	 * @param suggestion the suggestion to create a unique key for.
	 * @return the suggestions key.
	 */
	private String getUniqueSuggestionKey(String suggestion) {
		suggestion = StringUtils.lowerCase(suggestion);
		suggestion = StringUtils.trim(suggestion);
		suggestion = suggestion.replaceAll("/[^A-Za-z0-9 ]/", "-");
		suggestion = suggestion.replaceAll("-+", "-");
		return suggestion;
	}

	@Override
	public String[] getSearchPaths(ResourceResolver resolver, String searchRootPagePath) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("path", searchRootPagePath);
		params.put("group.1_property", "searchingPaths");
		params.put("group.1_property.operation", JcrPropertyPredicateEvaluator.OP_EXISTS);
		params.put("group.2_property", JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY);
		params.put("group.2_property.value", "pcwr/components/structure/parts/search");
		params.put("group.p.and", "true");
		Query query = queryBuilder.createQuery(PredicateGroup.create(params), resolver.adaptTo(Session.class));
		SearchResult result = query.getResult();
		List<Hit> hitList = result.getHits();
		if (!hitList.isEmpty()) {
			Resource searchResource;
			try {
				log.debug("Path from hit::{}", hitList.get(0).getPath());
				searchResource = hitList.get(0).getResource();
				ValueMap vm = searchResource.getValueMap();
				return getSearchPaths(vm);
			} catch (RepositoryException e) {
				e.printStackTrace();
			}

		}
		return new String[] { "/content/pl-corp" };
	}

	private String[] getSearchPaths(ValueMap vm) {
		if (vm.get(SEARCHPATH_PROPERTY_NAME, null) != null
				&& (vm.get(SEARCHPATH_PROPERTY_NAME, null) instanceof String)) {
			return new String[] { vm.get(SEARCHPATH_PROPERTY_NAME, String.class) };
		} else if (vm.get(SEARCHPATH_PROPERTY_NAME, null) != null
				&& (vm.get(SEARCHPATH_PROPERTY_NAME, null) instanceof String[])) {
			return vm.get(SEARCHPATH_PROPERTY_NAME, String[].class);
		}
		return new String[] { "/content/pl-corp" };
	}
}
