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
public class LimitPredicateFactoryImpl implements PredicateFactory {

    public static final String PN_LIMIT = "limit";
    public static final int DEFAULT_LIMIT = 10;

    @Override
    public String getTitle() {
        return null;
    }

    @Override
    public String getName() {
        return PN_LIMIT;
    }

    @Override
    public Map<String, String> getRequestPredicate(SlingHttpServletRequest request) {
        final Map<String, String> params = new HashMap<String, String>();

        final int limit = new ComponentInheritanceValueMap(request.getResource()).getInherited(PN_LIMIT, DEFAULT_LIMIT);

        params.put("p.limit", String.valueOf(limit));

        return params;
    }

    @Override
    public List<PredicateOption> getPredicateOptions(SlingHttpServletRequest request) {
        return Collections.emptyList();
    }
}
