/**
 * 
 */
package com.paclife.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;

import javax.servlet.ServletException;

import org.apache.commons.lang.StringUtils;

// Felix Imports
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Properties;
import org.osgi.service.component.annotations.Property;
import org.osgi.service.component.annotations.Service;*/

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

//OSGi Required for Servlets
//import org.apache.sling.api.servlets.HttpConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.paclife.core.util.ConnectionUtil;

//OSGI Annotation Declaration R7 Format
/*@Component(name = "Find an Advisor", service={},
				property = {"sling.servlet.methods= " + HttpConstants.METHOD_POST,
								"sling.servlet.paths"= + "/bin/findadvisor/geolocation",
								"sling.servlet.extensions=" + "json"})*/

@Component(metatype = false, label = "Find an Advisor", description = "")
@Service
@Properties({
    @Property(name = "sling.servlet.methods", value = {"POST"}, propertyPrivate = true),
    @Property(name = "sling.servlet.paths", value = "/bin/findadvisor/geolocation", propertyPrivate = true),
    @Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true)
})
public class FindAdvisorService extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(FindAdvisorService.class);
	/**
	 *  
	 */
	private static final long serialVersionUID = -1028827313231568464L;
	
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		doPost(request,response);
	}
	@Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		//PI 160628
		
		String clientIP = StringUtils.trim( StringUtils.substringBefore(request.getHeader("x-forwarded-for"), ","));
		log.error("FindAdvisorService after clientIP ----> "+clientIP);
		// Code Remediation - Detected as unused
		// String action = request.getParameter("action");
					
		String latitude = request.getParameter("latitude");
		String longitude = request.getParameter("longitude");
		// Code Remediation - Detected as unused
		// String mobile = request.getParameter("mobile");
		String query = StringUtils.stripToEmpty( request.getParameter("query"));
		String radius = "250";
		if(StringUtils.isEmpty(query))query = "DEFAULT";
		query = query.replaceAll("[^A-Za-z0-9\\,]", ""); 
		query = URLEncoder.encode(query,"UTF-8");
		
		int 	APP_LOG_CORP_SITE = 15;
		String jsonObject =  ConnectionUtil.getResponseString(ConnectionUtil.getOSBUrl(request)+"Advisor/V1/AdvisorGeolocationInquiryProxyService/"+latitude+"/"+longitude+"/"+radius+"/"+query+"/"+APP_LOG_CORP_SITE+"/"+clientIP);
		
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(jsonObject);
		out.flush();
		
	}
	


}