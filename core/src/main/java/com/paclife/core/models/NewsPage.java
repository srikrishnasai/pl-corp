/*
 * Pacific Life Java
 * Copyright (C) 2008-2019 Pacific Life Insurance Company. All Rights Reserved.
 * mailto:contact AT pacificlife DOT com
 */

package com.paclife.core.models;

import java.util.Date;

public class NewsPage {

	private String title;
	private Date date;
	private String description;
	private String path;

	public String getTitle() {
		return title;
	}

	public Date getDate() {
		return date;
	}

	public String getDescription() {
		return description;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
}
