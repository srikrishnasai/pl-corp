package com.paclife.core.charts;

import java.util.List;

public class BarChartPojo {

	private String chartHeading;
	private String chartSubHeading;
	private String chartHeadingSup;
	private List<BarChartMultiFieldItemsPojo> chartBarMultiFieldItems;

	public String getChartHeading() {
		return chartHeading;
	}

	public void setChartHeading(String chartHeading) {
		this.chartHeading = chartHeading;
	}

	public String getChartHeadingSup() {
		return chartHeadingSup;
	}

	public void setChartHeadingSup(String chartHeadingSup) {
		this.chartHeadingSup = chartHeadingSup;
	}

	public String getChartSubHeading() {
		return chartSubHeading;
	}

	public void setChartSubHeading(String chartSubHeading) {
		this.chartSubHeading = chartSubHeading;
	}

	public List<BarChartMultiFieldItemsPojo> getChartBarMultiFieldItems() {
		return chartBarMultiFieldItems;
	}

	public void setChartBarMultiFieldItems(List<BarChartMultiFieldItemsPojo> chartBarMultiFieldItems) {
		this.chartBarMultiFieldItems = chartBarMultiFieldItems;
	}

}
