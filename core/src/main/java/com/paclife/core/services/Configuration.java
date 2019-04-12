
package com.paclife.core.services;

import java.util.Map;
import java.util.logging.Logger;

// Felix Imports
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Property;
import org.osgi.service.component.annotations.Service;*/


import org.apache.sling.commons.osgi.PropertiesUtil;

//OSGI Annotation Declaration R7 Format
/* @Component(name = "Pacific Life Configurations", service = {Configuration.class},
				property = {"process.label= Add Border to Thumbnail"})
@ServiceDescription("Configurations for all Pacific Life Services") */

@SuppressWarnings("deprecation")
@Service(value = Configuration.class)
@Component(
			label = "Pacific Life Configurations",
			description = "Configurations for all Pacific Life Services",
			immediate = true,
			metatype = true)
public class Configuration {

	private String productListUrl;

	private String productInfoUrl;

	private String googleMapsApiKey;
	
	private String fafpWebserviceUrl;

	public String getProductListUrl() {
		return productListUrl;
	}

	public String getProductInfoUrl() {
		return productInfoUrl;
	}

	public String getGoogleMapsApiKey() {
		return googleMapsApiKey;
	}


	public String getFafpWebserviceUrl() {
		return fafpWebserviceUrl;
	}


	@Property(	label = "Pacific Life - Daily Unit Values - Product List URL",
				value = "/bin/duv/retrieveproducts")
	private static final String PCWR_PRODUCT_LIST_URL = "productListUrl";

	@Property(	label = "Pacific Life - Daily Unit Values - Product Information",
				value = "/bin/duv/retrievevalues?productid={id}")
	private static final String PCWR_PRODUCT_INFO_URL = "productInfoUrl";

	@Property(	label = "Pacific Life - Google Maps API Key",value = "AIzaSyBnuzgGCPJMh4DlCKKWD6lI53bU76-FLoI")
	private static final String PCWR_GOOGLE_MAPS_API_KEY = "googleMapsApiKey";

	@Property(	label = "Pacific Life - Find a Professional Webservice URL",value = "/bin/findadvisor/geolocation")
	private static final String PCWR_FAFP_WEBSERVICE_URL = "fafpWebserviceUrl";

	@Activate
	public void activate(Map<String, Object> properties) throws Exception {

		this.productListUrl = PropertiesUtil.toString(properties.get(PCWR_PRODUCT_LIST_URL), "");

		this.productInfoUrl = PropertiesUtil.toString(properties.get(PCWR_PRODUCT_INFO_URL), "");
		
		this.googleMapsApiKey = PropertiesUtil.toString(properties.get(PCWR_GOOGLE_MAPS_API_KEY), "");

		this.fafpWebserviceUrl = PropertiesUtil.toString(properties.get(PCWR_FAFP_WEBSERVICE_URL), "");
	}

}