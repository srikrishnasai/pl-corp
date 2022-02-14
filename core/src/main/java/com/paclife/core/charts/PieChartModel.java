package com.paclife.core.charts;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = Resource.class)
public class PieChartModel {

	Logger logger = LoggerFactory.getLogger(PieChartModel.class);

	@Self
	public Resource resource;
	
	private List<PieChartMultiFieldItemsPojo> multiFieldItems;
	private List<String> barColors;
	private List<String> barValues;
	private List<String> barLabels;
	private List<Double> authoredBarValues;
	private List<Double> barWidths;
	
	private static final String MULTIFIELD_ITEMS_NODE_NAME = "multiFieldItems";

	@PostConstruct
	protected void activate() {
		this.multiFieldItems = new ArrayList<PieChartMultiFieldItemsPojo>();
		this.barColors = new ArrayList<String>();
		this.barValues = new ArrayList<String>();
		this.barLabels = new ArrayList<String>();
		this.authoredBarValues = new ArrayList<Double>();
		this.barWidths = new ArrayList<Double>();
		
		double pieChartTotal = 0;

		if (null != resource) {
			Resource multiFieldResource = resource.getChild(MULTIFIELD_ITEMS_NODE_NAME);
			if (null != multiFieldResource) {
				Iterator<Resource> multiFieldIterator = multiFieldResource.listChildren();
				while (multiFieldIterator.hasNext()) {
					Resource multiFieldItem = multiFieldIterator.next();
					if (null != multiFieldItem) {
						
						PieChartMultiFieldItemsPojo pieChartMultiFieldItemsPojo = new PieChartMultiFieldItemsPojo();
						ValueMap multiFieldItemProperties = multiFieldItem.getValueMap();
						
						if (null != multiFieldItemProperties) {
							String barValue = multiFieldItemProperties.get("barValue", StringUtils.EMPTY);
							String barColor = multiFieldItemProperties.get("barColor", StringUtils.EMPTY);
							String barLabel = multiFieldItemProperties.get("barLabel", StringUtils.EMPTY);
							
							if(null != barValue && StringUtils.isNotBlank(barValue)) {
								this.barValues.add(barValue);
								this.barColors.add(barColor);
								this.barLabels.add(barLabel);
								
								this.authoredBarValues.add(Double.parseDouble(barValue.replaceAll(",","").trim().replaceAll(" ", "")));
								pieChartMultiFieldItemsPojo.setBarValue(barValue);
								pieChartMultiFieldItemsPojo.setBarColor(barColor);
								pieChartMultiFieldItemsPojo.setBarLabel(barLabel);
							}
						}
						if (null != pieChartMultiFieldItemsPojo) {
							this.multiFieldItems.add(pieChartMultiFieldItemsPojo);
						}
					}
				}

				if(null != authoredBarValues && authoredBarValues.size() > 0) {
					for(double value : authoredBarValues) {
						pieChartTotal = pieChartTotal + value;
					}
				}

				for(PieChartMultiFieldItemsPojo multiFieldItem : this.multiFieldItems) {
					double currentBarValue = Double.parseDouble(multiFieldItem.getBarValue().replaceAll(",","").trim().replaceAll(" ", ""));
					double barWidth = Math.round( ( currentBarValue / pieChartTotal ) * 100 );
					
					if(barWidth > 5) {
						multiFieldItem.setBarWidth(Double.toString(barWidth));
						this.barWidths.add(barWidth);
					} else if(barWidth >= 0 && barWidth <= 5) {
						this.barWidths.add(6D);
					}
				}
			}
		}
	}

	public List<PieChartMultiFieldItemsPojo> getMultiFieldItems() {
		return this.multiFieldItems;
	}

	public void setMultiFieldItems(List<PieChartMultiFieldItemsPojo> multiFieldItems) {
		this.multiFieldItems = multiFieldItems;
	}

	public List<String> getBarColors() {
		return barColors;
	}

	public List<Double> getBarWidths() {
		return barWidths;
	}

	public void setBarWidths(List<Double> barWidths) {
		this.barWidths = barWidths;
	}

	public void setBarColors(List<String> barColors) {
		this.barColors = barColors;
	}

	public List<String> getBarValues() {
		return barValues;
	}

	public void setBarValues(List<String> barValues) {
		this.barValues = barValues;
	}

	public List<String> getBarLabels() {
		return barLabels;
	}

	public void setBarLabels(List<String> barLabels) {
		this.barLabels = barLabels;
	}
}
