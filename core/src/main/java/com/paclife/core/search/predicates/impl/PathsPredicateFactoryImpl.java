package com.paclife.core.search.predicates.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
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

import com.day.cq.commons.inherit.ComponentInheritanceValueMap;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.eval.JcrPropertyPredicateEvaluator;
import com.day.cq.wcm.api.NameConstants;
import com.paclife.core.search.predicates.PredicateFactory;
import com.paclife.core.search.predicates.PredicateOption;

//OSGI Annotation Declaration R7 Format
/* @Component(service={}) */

@Component
@Service
public class PathsPredicateFactoryImpl implements PredicateFactory {

	public static final String SEARCHPATH_PROPERTY_NAME = "searchingPaths";
	public static final String ALLOWED_ROOT = "/content";
	public static final String ALLOWED_DAM_ROOT = "/content/dam";
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
		int index = 1;
		final ComponentInheritanceValueMap vm = new ComponentInheritanceValueMap(resource);
		String[] pathList = getSearchPaths(vm);
		if (pathList == null) {
			throw new IllegalArgumentException("[" + SEARCHPATH_PROPERTY_NAME + "] not specified.");
		}

		if (pathList != null) {
			for (String path : pathList) {
				if (StringUtils.startsWith(path, ALLOWED_DAM_ROOT)) {
					params.put("group." + index + "_group.type", DamConstants.NT_DAM_ASSET);
					params.put("group." + index + "_group.path", path);
					params.put("group." + index + "_group.1_property", "jcr:content/metadata/dc:format");
					params.put("group." + index + "_group.1_property.value", "application/pdf");
					params.put("group." + index + "_group.2_property", "jcr:content/metadata/includeInSearch");
					params.put("group." + index + "_group.2_property.operation",
							JcrPropertyPredicateEvaluator.OP_EXISTS);
					index++;
				} else if (StringUtils.startsWith(path, ALLOWED_ROOT)) {
					params.put("group." + index + "_group.type", NameConstants.NT_PAGE);
					params.put("group." + index + "_group.path", path);
					params.put("group." + index + "_group.1_property.operation", JcrPropertyPredicateEvaluator.OP_NOT);
					params.put("group." + index + "_group.1_property", "jcr:content/hideInSearch");
					index++;
				} else {
					throw new IllegalArgumentException(
							SEARCHPATH_PROPERTY_NAME + "=" + path + " is not inside of " + ALLOWED_ROOT);
				}
			}
		}
		params.put("group.p.or", "true");
		return params;
	}

	private String[] getSearchPaths(ComponentInheritanceValueMap vm) {
		if (vm.getInherited(SEARCHPATH_PROPERTY_NAME, null) != null
				&& (vm.getInherited(SEARCHPATH_PROPERTY_NAME, null) instanceof String)) {
			return new String[] { vm.getInherited(SEARCHPATH_PROPERTY_NAME, String.class) };
		} else if (vm.getInherited(SEARCHPATH_PROPERTY_NAME, null) != null
				&& (vm.getInherited(SEARCHPATH_PROPERTY_NAME, null) instanceof String[])) {
			return vm.getInherited(SEARCHPATH_PROPERTY_NAME, String[].class);
		}
		return new String[] { "/content/pl-corp" };
	}

	@Override
	public List<PredicateOption> getPredicateOptions(SlingHttpServletRequest request) {
		return Collections.emptyList();
	}
}
