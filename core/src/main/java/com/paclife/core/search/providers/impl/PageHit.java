package com.paclife.core.search.providers.impl;

import java.util.HashMap;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import com.day.cq.search.result.Hit;

final class PageHit implements Hit {
	private Hit hit;
	private Resource containingPage;

	public PageHit(Hit hit, Resource containingPage) {
		this.hit = hit;
		this.containingPage = containingPage;
	}

	@Override
	public String getExcerpt() throws RepositoryException {
		return (String) this.getProperties().get("cq:Description");
	}

	@Override
	public Map<String, String> getExcerpts() throws RepositoryException {
		return new HashMap<>();
	}

	@Override
	public long getIndex() {
		return hit.getIndex();
	}

	@Override
	public Node getNode() throws RepositoryException {
		return containingPage.getResourceResolver().adaptTo(Node.class);
	}

	@Override
	public String getPath() throws RepositoryException {
		return containingPage.getPath();
	}

	@Override
	public ValueMap getProperties() throws RepositoryException {
		return containingPage.getValueMap();
	}

	@Override
	public Resource getResource() throws RepositoryException {
		return containingPage;
	}

	@Override
	public double getScore() throws RepositoryException {
		return hit.getScore();
	}

	@Override
	public String getTitle() throws RepositoryException {
		return containingPage.getName();
	}
}