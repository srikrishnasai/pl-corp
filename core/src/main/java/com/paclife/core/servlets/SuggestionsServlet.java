package com.paclife.core.servlets;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import javax.jcr.RepositoryException;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.NameConstants;
import com.paclife.core.search.impl.SuggestionsImpl;
import com.paclife.core.search.predicates.impl.PathsPredicateFactoryImpl;
import com.paclife.core.search.providers.SuggestionProvider;

@Component(metatype = false, label = "Get Auto Suggestions", description = "")
@Service
@Properties({ @Property(name = "sling.servlet.methods", value = { "GET" }, propertyPrivate = true),
		@Property(name = "sling.servlet.paths", value = "/bin/paclife/autosuggestions", propertyPrivate = true),
		@Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true) })
public class SuggestionsServlet extends SlingAllMethodsServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final Logger log = LoggerFactory.getLogger(SuggestionsImpl.class);
	private static final int DEFAULT_SUGGESTIONS_LIMIT = 5;

	List<String> suggestions = Collections.emptyList();

	@Reference
	SuggestionProvider suggestionProvider;

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		log.debug("Entered into Suggestion Servlet");
		try {
			String searchTerm = StringUtils.isNotBlank(request.getParameter("q")) ? request.getParameter("q")
					: StringUtils.EMPTY;
			log.debug("Search Term ::{}", searchTerm);
			final String[] searchPaths = suggestionProvider.getSearchPaths(request.getResourceResolver(),
					request.getParameter(PathsPredicateFactoryImpl.SEARCHPATH_PROPERTY_NAME));
			suggestions = suggestionProvider.suggest(request.getResourceResolver(), searchPaths, NameConstants.NT_PAGE,
					searchTerm, DEFAULT_SUGGESTIONS_LIMIT);
			JSONObject jObj = new JSONObject();
			try {
				jObj.put("searchTerm", searchTerm);
				jObj.put("suggestions", suggestions);
			} catch (JSONException e) {
				log.error("Error Occured while fetching suggestions ::{}", e.getMessage());
			}
			response.getWriter().print(jObj);
		} catch (RepositoryException e) {
			log.error("Repository Exception Occured while fetching suggestions ::{}", e.getMessage());
		}
	}

}
