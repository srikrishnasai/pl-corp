package com.paclife.core.search.predicates;

import aQute.bnd.annotation.ProviderType;

import java.util.List;

@ProviderType
public interface PredicateGroup {
    String getName();

    String getTitle();

    List<PredicateOption> getOptions();
}
