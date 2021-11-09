package com.paclife.core.charts;

import java.util.List;

public class BarChartPojo {

	private String chartHeading;
	private String chartSubHeading;
	private List<BarChartMultiFieldItemsPojo> chartBarMultiFieldItems;

	public String getChartHeading() {
		return chartHeading;
	}

	public void setChartHeading(String chartHeading) {
		this.chartHeading = chartHeading;
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
