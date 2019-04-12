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

//OSGI Annotation Declaration R7 Format
/*@Component(name = "RetrieveProducts GET Servlet", service={},
				property = {"sling.servlet.methods= " + HttpConstants.METHOD_GET,
								"sling.servlet.paths"= + "/bin/duv/retrieveproducts",
								"sling.servlet.extensions=" + "json"})*/

@Component(metatype = false, label = "RetrieveProducts GET Servlet", description = "")
@Service
@Properties({
    @Property(name = "sling.servlet.methods", value = {"GET"}, propertyPrivate = true),
    @Property(name = "sling.servlet.paths", value = "/bin/duv/retrieveproducts", propertyPrivate = true),
    @Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true)
})
public class RetrieveProductsService extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(RetrieveProductsService.class);
	/**
	 * 
	 */
	private static final long serialVersionUID = -1028827313231568464L;

	@Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		String jsonObject =  ConnectionUtil.getResponseString(ConnectionUtil.getOSBUrl(request)+"External/Life/DailyUnitValues/V1/RetrieveProductsProxy");
		
		if(log.isDebugEnabled())
			log.debug("RetrieveProductsService User ---->  :url:"+ ConnectionUtil.getOSBUrl(request)+"External/Life/DailyUnitValues/V1/RetrieveProductsProxy" + " display products jsonObject:"+ jsonObject );
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(jsonObject);
		out.flush();
	}

}
