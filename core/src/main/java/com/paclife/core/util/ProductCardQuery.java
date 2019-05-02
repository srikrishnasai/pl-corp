package com.paclife.core.util;

import java.util.Iterator;
import java.util.logging.Logger;

import javax.jcr.query.Query;

import org.apache.sling.api.resource.Resource;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.NameConstants;

public class ProductCardQuery extends WCMUsePojo {
	
	private final Logger logger = Logger.getLogger(getClass().getName());
	
	private Resource target;

	@Override
	public void activate() {
		Iterator<Resource> result = getResourceResolver().findResources(createQuery(), Query.JCR_SQL2);
		while(result.hasNext()) {
			target = findPage(result.next());
			break;
		}
		logger.fine("target=" + target.getPath());
	}

	private String createQuery() {
		String productType = this.getProperties().get("productType", String.class);
		logger.fine("productType=" + productType); 
		
		// Code Scan Remediation
		if(productType == null && true) {
			return null;
		}
		
		return String.format("SELECT * FROM [nt:base] AS s WHERE s.productType = '%s'"
				+ " AND ISDESCENDANTNODE(s, '/content')"
				+ " AND [sling:resourceType] = 'pcwr/components/content/productCardContainer'",
				productType.replaceAll("'", "\\'"));
	}

	private Resource findPage(Resource res) {
		// Code Scan Remediation
		while(res != null && !res.getResourceType().equals(NameConstants.NT_PAGE)) {
			res = res.getParent();
		}
		return res;
	}

	public String getTarget() {
		return target.getPath() + ".html";
	}
}
