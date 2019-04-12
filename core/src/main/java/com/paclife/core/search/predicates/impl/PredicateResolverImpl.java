package com.paclife.core.search.predicates.impl;

import com.paclife.core.search.predicates.PredicateFactory;
import com.paclife.core.search.predicates.PredicateGroup;
import com.paclife.core.search.predicates.PredicateResolver;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;
import org.osgi.framework.BundleContext; 
import org.osgi.service.component.ComponentContext;

// Felix Imports
import org.apache.felix.scr.annotations.*;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Properties;
import org.osgi.service.component.annotations.Property;
import org.osgi.service.component.annotations.Service;
import org.osgi.service.metatype.annotations.Reference;*/

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

//OSGI Annotation Declaration R7 Format
/* @Component(service={})
@Reference(
                referenceInterface = PredicateFactory.class,
                policy = ReferencePolicy.DYNAMIC,
                cardinality = ReferenceCardinality.OPTIONAL_MULTIPLE)
}*/

@Component(metatype=true)
@References({
        @Reference(
                referenceInterface = PredicateFactory.class,
                policy = ReferencePolicy.DYNAMIC,
                cardinality = ReferenceCardinality.OPTIONAL_MULTIPLE)
})
@Service
public class PredicateResolverImpl implements PredicateResolver, EventListener, Runnable {
    final ConcurrentHashMap<String, PredicateFactory> factories = new ConcurrentHashMap<String, PredicateFactory>();
    private static final Logger log = LoggerFactory.getLogger(PredicateResolverImpl.class);
    
    private BundleContext bundleContext = null;
    //https://hashimkhan.in/aem-adobecq5-code-templates/service/
    //FrameworkUtil
    public Map<String, String> getRequestPredicates(SlingHttpServletRequest request) {
        final Map<String, String> params = new HashMap<String, String>();


		params.putAll(new AudiencePredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new ExcerptPredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new FullltextPredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new GuessTotalPredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new LimitPredicateFactoryImpl().getRequestPredicate(request));
		//params.putAll(new NodeTypesPredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new OffsetPredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new ProductPredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new VersionPredicateFactoryImpl().getRequestPredicate(request));
		params.putAll(new PathsPredicateFactoryImpl().getRequestPredicate(request));
		
        /*for (final PredicateFactory factory : factories.values()) {
            params.putAll(factory.getRequestPredicate(request));
        }*/

        log.info(params.toString().replace("]","\n"));

        return params;
    }

    public List<PredicateGroup> getPredicateGroups(SlingHttpServletRequest request) {
        final List<PredicateGroup> predicateGroups = new ArrayList<PredicateGroup>();

        for (final PredicateFactory factory : factories.values()) {
            predicateGroups.add(new PredicateGroupImpl(factory.getTitle(), factory.getName(), factory.getPredicateOptions(request)));
        }

        return predicateGroups;
    }

    protected final void bindPredicateFactory(final PredicateFactory service, final Map<Object, Object> props) {
        final String type = PropertiesUtil.toString(props.get("service.pid"), null);
        if (type != null) {
            this.factories.put(type, service);
        }
    }

    protected final void unbindPredicateFactory(final PredicateFactory service, final Map<Object, Object> props) {
        final String type = PropertiesUtil.toString(props.get("service.pid"), null);
        if (type != null) {
            this.factories.remove(type);
        }
    }
    
    protected void activate(ComponentContext ctx) {
    	bundleContext = ctx.getBundleContext();
        final String type = PropertiesUtil.toString(ctx.getProperties().get("service.pid"), null);
        
    	
	}

    protected void deactivate(ComponentContext componentContext) throws RepositoryException {
		
	
	}
    public void onEvent(EventIterator it) {
    	
    }
    public void run() {
    	
	}
}
