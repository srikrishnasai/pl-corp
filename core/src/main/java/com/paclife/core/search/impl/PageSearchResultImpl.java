package com.paclife.core.search.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.paclife.core.search.SearchResult;

@Model(adaptables = Resource.class, adapters = SearchResult.class, resourceType = "cq:Page")
public class PageSearchResultImpl implements com.paclife.core.search.SearchResult {

	private static final Logger log = LoggerFactory.getLogger(PageSearchResultImpl.class);

	private static final String PAGE_EXTENSION = ".html";
	private static final String NBSP_HTML = "&nbsp;";

	@Self
	private Resource resource;

	@Inject
	private ResourceResolver resourceResolver;

	String fixedUrl = StringUtils.EMPTY;

	ValueMap vm;

	@PostConstruct
	protected void intialize() {
		// Code Scan Remediation
		if (resourceResolver.adaptTo(PageManager.class) != null
				&& resourceResolver.adaptTo(PageManager.class).getContainingPage(resource) != null) {
			this.page = resourceResolver.adaptTo(PageManager.class).getContainingPage(resource);
			this.vm = page.getContentResource().getValueMap();
		}
		log.info("here");
	}

	private Page page;

	private List<String> excerpts = new ArrayList<String>();

	public String getContentType() {
		return "page";
	}

	public String getPath() {
		return this.page.getPath();
	}

	public String getURL() {
		return getPath() + PAGE_EXTENSION;
	}

	public String getTitle() {
		return StringUtils.defaultIfBlank(StringUtils.defaultIfBlank(page.getPageTitle(), page.getTitle()),
				page.getName());
	}

	@JsonInclude(value = JsonInclude.Include.NON_EMPTY)
	public String getDescription() {
		String description = "";
		if (this.excerpts.size() > 0) {
			description = StringUtils.join(this.excerpts, DESCRIPTION_ELLIPSIS);
			if (StringUtils.isNotBlank(description)) {
				description = StringUtils.trim(description);
			}
		}

		if (StringUtils.isBlank(description)) {
			description = StringUtils
					.substringBeforeLast(StringUtils.left(page.getDescription(), DESCRIPTION_MAX_LENGTH), " ");
			if (StringUtils.isNotBlank(description)) {
				description += DESCRIPTION_ELLIPSIS;
			}
		}

		return StringUtils.isBlank(description) ? StringUtils.EMPTY : description;
	}

	@Override
	public List<String> getTagIds() {
		final List<String> tagIds = new ArrayList<String>();

		for (Tag tag : page.getTags()) {
			tagIds.add(tag.getTagID());
		}

		return tagIds;
	}

	@Override
	public void setExcerpts(Collection<String> excerpts) {
		for (String excerpt : excerpts) {
			// Funny clean-up require as getExcerpt() can sometimes inject &nbsp; into the
			// excerpt text..
			excerpt = StringUtils.replace(excerpt, NBSP_HTML, "");
			if (StringUtils.isNotBlank(excerpt)) {
				this.excerpts.add(StringUtils.trim(excerpt));
			}
		}
	}

	@Override
	public void setFixedUrl(String path) {
		fixedUrl = path;
	}

	public String getFixedUrl() {
		return fixedUrl;
	}

	@Override
	public String getIcon() {
		return StringUtils.EMPTY;
	}

	@Override
	public String[] getKeywords() {
		String[] keywords = vm.get("search_promote", String[].class);
		return ArrayUtils.isEmpty(keywords) ? ArrayUtils.EMPTY_STRING_ARRAY : keywords;
	}

	@Override
	public String getThumbnail() {
		return StringUtils.EMPTY;
	}

	@Override
	public String getThumbnailWebPreview() {
		return StringUtils.EMPTY;
	}
}
