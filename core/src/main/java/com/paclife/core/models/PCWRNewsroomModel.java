package com.paclife.core.models;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

/**
 * @author pravin.bathija
 *
 */
@Model(adaptables = Resource.class)
public class PCWRNewsroomModel {

	Logger logger = LoggerFactory.getLogger(PCWRNewsroomModel.class);

	@Inject
	public String newsArticlesFolderPath;

	@Inject
	public Resource resource;

	public static final String NEWS_TEMPLATE_PATH = "/conf/pcwr/settings/wcm/templates/news-page-template";
	public static final String EMPTY_PAGE_TEMPLATE_PATH = "/apps/pcwr/templates/emptyTemplate";

	private List<NewsPage> newsPageList = new ArrayList<NewsPage>();

	private Set<Integer> datesSet = new HashSet<Integer>();
	
	private Calendar cal = Calendar.getInstance();

	@PostConstruct
	protected void initiate() {

		ResourceResolver resourceResolver = resource.getResourceResolver();
		PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
		
		// Code Scan Remediation
		if(pageManager != null) {
			Page page = pageManager.getPage(newsArticlesFolderPath);

			if (page != null) {
				recursiveTraverse(page);
			}
		}
		
		logger.info("Final page count is " + newsPageList.size());;
	}

	/**
	 * @param page
	 * Logic to :
	 * Traverse all pages under configured Path  -->  Filter all pages based on Newspage template --> Read title, newsPagePublishDate and descrition
	 * 
	 */
	private void recursiveTraverse(Page page) {

		String templatePath = page.getProperties().get("cq:template", "");
							  // the alternative fails with permissions issue: page getTemplate getPath;
		
		if (templatePath.equalsIgnoreCase(NEWS_TEMPLATE_PATH)) {
			populateList(page);
		} else if (templatePath.equalsIgnoreCase(EMPTY_PAGE_TEMPLATE_PATH)) {
			Iterator<Page> children = page.listChildren();
			while (children.hasNext()) {
				Page childPage = (Page) children.next();
				recursiveTraverse(childPage);
			}
		} else {
            // Do nothing
        }

	}

	private void populateList(Page page) {
		NewsPage object = new NewsPage();
		ValueMap properties = page.getProperties();
		String title = properties.get("pageTitle", "");

		if (StringUtils.isEmpty(title)) {
			title = properties.get("jcr:title", "");
		}

		Date date = properties.get("newsPagePublishDate", Date.class);
		String description = properties.get("jcr:description", "");

		object.setTitle(title);
		object.setDescription(description);
		object.setDate(date);
		object.setPath(page.getPath());
		newsPageList.add(object);
		
		cal.setTime(date);
		
		updateUniqueDatesSet(cal.get(Calendar.YEAR));
	}

	
	/**
	 * @param i
	 * Add year to Set so that only unique values are maintained in the set
	 */
	private void updateUniqueDatesSet(int i) {
		datesSet.add(i);
	}

	public List<NewsPage> getNewsPageList() {
		return newsPageList;
	}

	public List<Integer> getSortedDateList() {
		
		if (datesSet.isEmpty()) {
			return Collections.emptyList();
		}
		ArrayList<Integer> uniqueDatesList = new ArrayList<Integer>(datesSet);
		
		// To get years in descending order
		Collections.reverse(uniqueDatesList);
		
		return uniqueDatesList;
	}

}
