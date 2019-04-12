package com.paclife.core.search;

import aQute.bnd.annotation.ProviderType;

@ProviderType
public interface SearchResultsPagination {
    String getLabel();
    long getOffset();
    boolean isActive();
    boolean isDisabled();
}
