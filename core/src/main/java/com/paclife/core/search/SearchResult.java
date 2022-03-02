package com.paclife.core.search;

import java.util.Collection;
import java.util.List;

import aQute.bnd.annotation.ProviderType;

@ProviderType
public interface SearchResult {

	public static final int DESCRIPTION_MAX_LENGTH = 320;
	public static final String DESCRIPTION_ELLIPSIS = " ... ";

	enum ContentType {
		PAGE, ASSET
	}

	String getContentType();

	List<String> getTagIds();

	String getURL();

	void setFixedUrl(String path);

	String getPath();

	String getTitle();

	String getDescription();

	String getIcon();

	String[] getKeywords();

	String getThumbnail();

	void setExcerpts(Collection<String> excerpt);

	String getThumbnailWebPreview();
}
