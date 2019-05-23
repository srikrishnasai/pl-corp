/**
 * 
 */
package com.paclife.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;

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

//We need to change this to use (JAX-RS) using Jersey
/**
 * @author ksequeir
 *
 */

//OSGI Annotation Declaration R7 Format
/*@Component(name = "RetrieveValues GET Servlet", service={},
				property = {"sling.servlet.methods= " + HttpConstants.METHOD_GET,
								"sling.servlet.paths"= + "/bin/duv/retrievevalues",
								"sling.servlet.extensions=" + "json"})*/

@Component(metatype = false, label = "RetrieveValues GET Servlet", description = "")
@Service
@Properties({
    @Property(name = "sling.servlet.methods", value = {"GET"}, propertyPrivate = true),
    @Property(name = "sling.servlet.paths", value = "/bin/duv/retrievevalues", propertyPrivate = true),
    @Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true)
})
public class RetrieveValuesService extends SlingAllMethodsServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7423923178014644982L;
	private static final Logger log = LoggerFactory.getLogger(RetrieveValuesService.class);
	
	@Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		String productid = request.getParameter("productid");
		String jsonObject =  ConnectionUtil.getResponseString(ConnectionUtil.getOSBUrl(request)+"External/Life/DailyUnitValues/V1/RetrieveValuesProxy/"+productid);
		
		if(log.isDebugEnabled()) {
			log.debug("RetrieveOfficeService  requested for productid "+ ConnectionUtil.getOSBUrl(request)+"External/Life/DailyUnitValues/V1/RetrieveValuesProxy/"+productid + ":jsonObject:"+ jsonObject );
        }
        
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(jsonObject);
		out.flush();
	}
}
