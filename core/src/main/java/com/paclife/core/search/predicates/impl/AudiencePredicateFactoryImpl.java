package com.paclife.core.search.predicates.impl;

import com.paclife.core.search.predicates.PredicateFactory;
import com.paclife.core.search.predicates.PredicateOption;
import org.apache.commons.lang.ArrayUtils;

// Felix Imports
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Service;*/

import org.apache.sling.api.SlingHttpServletRequest;

import java.util.List;
import java.util.Map;

//OSGI Annotation Declaration R7 Format
/* @Component(service={}) */

@Component
@Service
public class AudiencePredicateFactoryImpl extends AbstractTagPredicateFactory implements PredicateFactory {

    public static final String TAG_NAMESPACE = "audience";
    public static final String REQUEST_PARAM = "audience";
    public static final int GROUP_ID = 3000;
    public static final String PROPERTY_PATH = "jcr:content/cq:tags";

    @Override
    public String getTitle() {
        return "Audience";
    }

    @Override
    public String getName() {
        return REQUEST_PARAM;
    }

    @Override
    public Map<String, String> getRequestPredicate(SlingHttpServletRequest request) {
        final Map<String, String> params = super.getRequestPredicate(GROUP_ID, request.getParameterValues(REQUEST_PARAM), PROPERTY_PATH);
        // Overrides params as needed

        return params;
    }

    @Override
    public List<PredicateOption> getPredicateOptions(SlingHttpServletRequest request) {
        final List<PredicateOption> options = super.getPredicateOptions(request, TAG_NAMESPACE);

        for (final PredicateOption option : options) {
            option.setActive(ArrayUtils.contains(request.getParameterValues(REQUEST_PARAM), option.getValue()));
        }

        return options;
    }
}
