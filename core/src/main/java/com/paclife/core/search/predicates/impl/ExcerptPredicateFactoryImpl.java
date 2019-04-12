package com.paclife.core.search.predicates.impl;

import com.paclife.core.search.predicates.PredicateFactory;
import com.paclife.core.search.predicates.PredicateOption;
import com.day.cq.commons.inherit.ComponentInheritanceValueMap;

// Felix Imports
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Service;*/

import org.apache.sling.api.SlingHttpServletRequest;
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
public class ExcerptPredicateFactoryImpl implements PredicateFactory {
    private static final Logger log = LoggerFactory.getLogger(ExcerptPredicateFactoryImpl.class);

    public static final String PN_USE_EXCERPT = "useExcerpt";
    public static final boolean DEFAULT_USE_EXCERPT = false;

    @Override
    public String getTitle() {
        return null;
    }

    @Override
    public String getName() {
        return PN_USE_EXCERPT;
    }

    @Override
    public Map<String, String> getRequestPredicate(SlingHttpServletRequest request) {
        final Map<String, String> params = new HashMap<String, String>();

        final boolean useExcerpt = new ComponentInheritanceValueMap(request.getResource()).getInherited(PN_USE_EXCERPT, DEFAULT_USE_EXCERPT);

        params.put("p.excerpt", String.valueOf(useExcerpt));

        return params;
    }

    @Override
    public List<PredicateOption> getPredicateOptions(SlingHttpServletRequest request) {
        return Collections.emptyList();
    }
}
