package com.paclife.core.models;

import java.util.Iterator;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

@Model(adaptables = Resource.class)
public class PCWRMultifieldItemsModel {

	@Inject
	@Optional
	public Resource multiFieldItems;

	public Number countItems() {
		int count = 0;

		if (multiFieldItems != null) {
			Iterator<Resource> iter = multiFieldItems.listChildren();
			while (iter.hasNext()) {
				++count;
				iter.next();
			}
		}

		return count;
	}
}
