package com.paclife.core.search.predicates.impl;

import com.paclife.core.search.predicates.PredicateFactory;
import com.paclife.core.search.predicates.PredicateOption;
import com.day.cq.commons.inherit.ComponentInheritanceValueMap;
import org.apache.commons.lang.StringUtils;

// Felix Imports
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Service;*/

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//OSGI Annotation Declaration R7 Format
/* @Component(service={}) */

@Component
@Service
public class PathsPredicateFactoryImpl implements PredicateFactory {

	public static final String SEARCHPATH_PROPERTY_NAME = "searchPaths";
	public static final String ALLOWED_ROOT = "/content";

	private static final Logger log = LoggerFactory.getLogger(PathsPredicateFactoryImpl.class);

	@Override
	public String getTitle() {
		return null;
	}

	@Override
	public String getName() {
		return SEARCHPATH_PROPERTY_NAME;
	}

	@Override
	public Map<String, String> getRequestPredicate(SlingHttpServletRequest request) {
		
		log.info("Preparing request predicate.");
		
		final Map<String, String> params = new HashMap<String, String>();

		final Resource resource = request.getResource();
		
		log.info("Path = " + resource.getPath());
		
		final ComponentInheritanceValueMap vm = new ComponentInheritanceValueMap(resource);
		final String pathList = vm.getInherited(SEARCHPATH_PROPERTY_NAME, null);
		if(pathList == null) {
			throw new IllegalArgumentException("[" + SEARCHPATH_PROPERTY_NAME + "] not specified.");
		}

		for (String path : pathList.split(",")) {
			if (!StringUtils.startsWith(path, ALLOWED_ROOT)) {
				throw new IllegalArgumentException(SEARCHPATH_PROPERTY_NAME + "=" + path + " is not inside of " + ALLOWED_ROOT);
			}
		}

		params.put("path", pathList);
		return params;
	}

	@Override
	public List<PredicateOption> getPredicateOptions(SlingHttpServletRequest request) {
		return Collections.emptyList();
	}
}
