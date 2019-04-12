package com.paclife.core.search;

import aQute.bnd.annotation.ProviderType;
import com.paclife.core.search.predicates.PredicateGroup;

import java.util.List;

@ProviderType
public interface SearchFacets {
    List<PredicateGroup> getPredicateGroups();
}
