package com.paclife.core.charts;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = Resource.class)
public class BarChartModel {

	Logger logger = LoggerFactory.getLogger(BarChartModel.class);

	@Self
	public Resource resource;
	
	@Inject
	@Optional
	@Default(values="0")
	public String numberOfCharts;

	private List<BarChartPojo> charts;
	private static final String MULTIFIELD_ITEMS_NODE_NAME = "/multiFieldItems";

	@PostConstruct
	protected void activate() {
		this.charts = new ArrayList<BarChartPojo>();
		int noOfCharts = Integer.parseInt(numberOfCharts);
		if (null != resource && noOfCharts > 0) {
			ResourceResolver resourceResolver = resource.getResourceResolver();
			if (null != resourceResolver) {
				Iterator<Resource> chartsIterator = resource.listChildren();
				int count = 0;
				/* Upto four charts can be authored, and each authored chart data is stored in a separate node */
				while (chartsIterator.hasNext()) {
					Resource chart = chartsIterator.next();
					if (null != chart && null != chart.getPath() && count < noOfCharts) {
						BarChartPojo barChartPojo = new BarChartPojo();
						ValueMap chartProperties = chart.getValueMap();
						barChartPojo.setChartHeading(
								chartProperties.getOrDefault("chartHeading", StringUtils.EMPTY).toString());
						barChartPojo.setChartSubHeading(
								chartProperties.getOrDefault("chartSubHeading", StringUtils.EMPTY).toString());
						Resource multifield = resourceResolver
								.getResource(chart.getPath() + MULTIFIELD_ITEMS_NODE_NAME);

						if (null != multifield) {
							/* Each Bar Chart has the authored bars data stored inside a multifield */
							List<BarChartMultiFieldItemsPojo> barData = getBarChartMultiFieldData(multifield);
							if (null != barData) {
								barChartPojo.setChartBarMultiFieldItems(barData);
							}
						}

						if (null != barChartPojo) {
							charts.add(barChartPojo);
						}
					}
					count++;
				}
			}
		}
	}

	private List<BarChartMultiFieldItemsPojo> getBarChartMultiFieldData(Resource multifield) {
		
		List<BarChartMultiFieldItemsPojo> multiFieldItems = new ArrayList<BarChartMultiFieldItemsPojo>();
		List<Double> barValues = new ArrayList<Double>();
		
		Iterator<Resource> children = multifield.listChildren();
		/* iterates the mutlfield nodes that will have the authored bars data*/
		while(children.hasNext()) {
			Resource child = children.next();
			if(null != child) {
				ValueMap childValueMap = child.getValueMap();
				if(null != childValueMap) {
					String barValue = childValueMap.get("barValue", String.class);
					if(null != barValue && StringUtils.isNotBlank(barValue)) {
						BarChartMultiFieldItemsPojo item = new BarChartMultiFieldItemsPojo();
						item.setBarValue(barValue);
						item.setBarLabel(childValueMap.getOrDefault("barLabel", StringUtils.EMPTY).toString());
						item.setBarColor(childValueMap.getOrDefault("barColor", StringUtils.EMPTY).toString());
						barValues.add(Double.parseDouble(barValue.replaceAll(",","").trim().replaceAll(" ", "")));
						multiFieldItems.add(item);
					}
				}
			}
		}
		
		/* logic to calculate and set widths of each bar */
		if(null != multiFieldItems && null != barValues) {
			Double maxBarValue = Collections.max(barValues);
			if(null != maxBarValue && maxBarValue > 0) {
				for(int i = 0; i < multiFieldItems.size(); i++) {
					Double currentBarValue = Double.parseDouble(multiFieldItems.get(i).getBarValue().replaceAll(",","").trim().replaceAll(" ", ""));
					if(Double.compare(maxBarValue, currentBarValue) == 0) {
						multiFieldItems.get(i).setBarWidth("100");
					} else {
						Double width = (double) Math.round((currentBarValue * 100) / maxBarValue);
						if(null != width && width < 100) {
							multiFieldItems.get(i).setBarWidth(Double.toString(width));
						}
					}
				}
			}
		}
		
		return multiFieldItems;
	}

	public List<BarChartPojo> getCharts() {
		return charts;
	}

	public void setCharts(List<BarChartPojo> charts) {
		this.charts = charts;
	}

}
