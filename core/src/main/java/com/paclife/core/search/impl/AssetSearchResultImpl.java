package com.paclife.core.search.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.commons.util.DamUtil;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.paclife.core.search.SearchResult;

@Model(adaptables = Resource.class, adapters = SearchResult.class, resourceType = "dam:Asset")
public class AssetSearchResultImpl implements SearchResult {

	@Self
	private Resource resource = null;

	@Inject
	private ResourceResolver resourceResolver = null;

	String thumbnail = StringUtils.EMPTY;
	String fixedUrl = StringUtils.EMPTY;
	String thumbnailWebPreview = StringUtils.EMPTY;

	@PostConstruct
	protected void initModel() {
		this.asset = Optional.ofNullable(DamUtil.resolveToAsset(resource));
		this.thumbnail = this.asset.map(a -> a.getRendition("cq5dam.thumbnail.319.319.png").getPath())
				.orElse(StringUtils.EMPTY);
		this.thumbnailWebPreview = this.asset.map(a -> a.getRendition("cq5dam.web.1280.1280.jpeg").getPath())
				.orElse(StringUtils.EMPTY);
	}

	private Optional<Asset> asset = null;

	private List<String> excerpts = new ArrayList<String>();

	public String getContentType() {
		return "asset";
	}

	public String getPath() {
		return asset.map(Asset::getPath).orElse(StringUtils.EMPTY);
	}

	@Override
	public String getURL() {
		return getPath();
	}

	public String getTitle() {
		return asset.map(a -> a.getMetadataValue("dc:title")).filter(StringUtils::isNotEmpty)
				.orElse(asset.map(Asset::getName).filter(StringUtils::isNotEmpty).orElse(StringUtils.EMPTY));
	}

	@JsonInclude(value = JsonInclude.Include.NON_EMPTY)
	public String getDescription() {
		if (this.excerpts.size() > 2) {
			return StringUtils.trim(DESCRIPTION_ELLIPSIS + StringUtils.join(this.excerpts, DESCRIPTION_ELLIPSIS)
					+ DESCRIPTION_ELLIPSIS);
		} else {
			return asset.map(a -> StringUtils.left(a.getMetadataValue("dc:description"), DESCRIPTION_MAX_LENGTH))
					.orElse(StringUtils.EMPTY);
		}
	}

	@Override
	public List<String> getTagIds() {
		final TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
		final List<String> tagIds = new ArrayList<String>();

		// Code Scan Remediation
		if (tagManager != null) {
			for (Tag tag : tagManager.getTags(resource)) {
				tagIds.add(tag.getTagID());
			}
		}

		return tagIds;
	}

	@Override
	public void setExcerpts(Collection<String> excerpts) {
		this.excerpts = new ArrayList<String>(excerpts);
	}

	@Override
	public void setFixedUrl(String path) {
        this.fixedUrl = path;
	}

	@Override
	public String getIcon() {
		return StringUtils.EMPTY;
	}

	@Override
	public String[] getKeywords() {
		return ArrayUtils.EMPTY_STRING_ARRAY;
	}

	@Override
	public String getThumbnail() {
		return thumbnail;
	}
	
	@Override
	public String getThumbnailWebPreview() {
		return thumbnailWebPreview;
	}
	
	public String getFixedUrl() {
		return fixedUrl;
	}

}
