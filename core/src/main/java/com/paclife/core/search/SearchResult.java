package com.paclife.core.search;

import aQute.bnd.annotation.ProviderType;

import java.util.Collection;
import java.util.List;

@ProviderType
public interface SearchResult {
    
    public final class SearchResult {      
       public static final int DESCRIPTION_MAX_LENGTH = 320;
       public static final  String DESCRIPTION_ELLIPSIS = " ... ";
    }

    enum ContentType {
        PAGE,
        ASSET
    }

    ContentType getContentType();

    List<String> getTagIds();

    String getURL();

    String getPath();

    String getTitle();

    String getDescription();

    void setExcerpts(Collection<String> excerpt);
}
