package com.paclife.core.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;

// Felix Imports
import org.apache.felix.scr.annotations.sling.SlingServlet;

//OSGI Annotations
/*import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Properties;
import org.osgi.service.component.annotations.Property;
import org.osgi.service.component.annotations.Service;
import org.osgi.service.metatype.annotations.Reference;*/

//import org.apache.http.client.methods.CloseableHttpResponse;
//import org.apache.http.client.methods.HttpGet;
//import org.apache.http.impl.client.CloseableHttpClient;
//import org.apache.http.impl.client.HttpClients;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

//OSGi Required for Servlets
//import org.apache.sling.api.servlets.HttpConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.paclife.core.util.ConnectionUtil;
/*
import org.apache.sling.jcr.api.SlingRepository;
import org.apache.sling.jcr.api.SlingRepository;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
*/

//OSGI Annotation Declaration R7 Format
/*@Component(name = "Pacific Life Proxy Servlet", service={},
				property = {"sling.servlet.methods= " + HttpConstants.METHOD_GET,
								"sling.servlet.paths"= + "/bin/pacificlife/proxy",
								"sling.servlet.extensions=" + "html"})*/


@SlingServlet(
	    metatype = true,
	    paths = {"/bin/pacificlife/proxy"},
	    extensions = {"html"},
	    methods = "GET",
	    label = "Pacific Life Proxy Servlet",
	    description = "Pacific Life Proxy Servlet"
	)
/*
@Component(metatype = false, label = "Pacific Life Proxy Servlet", description = "")
@Service
@Properties({
    @Property(name = "sling.servlet.methods", value = {"GET"}, propertyPrivate = true),
    @Property(name = "sling.servlet.paths", value = "/bin/pacificlife/proxy", propertyPrivate = true),
    @Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true)
})*/
public class PCWRWebserviceProxyServlet extends SlingAllMethodsServlet {


	private static final long serialVersionUID = 1L;

	transient Logger logger = LoggerFactory.getLogger(PCWRWebserviceProxyServlet.class);

	String keyword = "";
	String location = "";
	
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		
		final PrintWriter writer = response.getWriter();
		keyword = request.getParameter("keyword");
		location = request.getParameter("location");
		
		String questionStr = prepareQuestionString();
		String inputXml = getInputXml(questionStr);
		
		String requestUrl = ConnectionUtil.getResponseString(ConnectionUtil.getOSBUrl(request) + "brassring/BrassringRestService?inputXml=" + URLEncoder.encode(inputXml, "UTF-8"));

		String reponse = executeRequest(requestUrl);
		String decodedResp = URLDecoder.decode(reponse, "UTF-8");
		writer.print(decodedResp.replaceAll("&lt;", "<").replaceAll("&gt;", ">"));

        writer.flush();
        writer.close();
	}

	/**
	 *  Question ID for Keyword = 7644
	 *	Question ID for Location = 22607
	 */
	private String  prepareQuestionString() {
		String questionStr = "";
		if (StringUtils.isEmpty(keyword) && StringUtils.isEmpty(location)) {
			questionStr = "<Question Sortorder=\"ASC\" Sort=\"No\"> <Id>7644</Id>  <Value> <![CDATA[TG_SEARCH_ALL]]></Value></Question>"+
							"<Question Sortorder=\"ASC\" Sort=\"No\"> <Id>22607</Id>  <Value> <![CDATA[TG_SEARCH_ALL]]></Value></Question>";
		}
		else if (!StringUtils.isEmpty(keyword) && StringUtils.isEmpty(location)) {
			questionStr = "<Question Sortorder=\"ASC\" Sort=\"No\"> <Id>7644</Id>  <Value> <![CDATA["+ keyword + "]]></Value></Question>";
		}
		else if (StringUtils.isEmpty(keyword) && !StringUtils.isEmpty(location)) {
			questionStr = "<Question Sortorder=\"ASC\" Sort=\"No\"> <Id>22607</Id>  <Value> <![CDATA["+ location + "]]></Value></Question>";
		}
		else {
			questionStr = "<Question Sortorder=\"ASC\" Sort=\"No\"> <Id>7644</Id>  <Value> <![CDATA["+ keyword + "]]></Value></Question>"   + 
					"<Question Sortorder=\"ASC\" Sort=\"No\"> <Id>22607</Id>  <Value> <![CDATA["+ location + "]]></Value></Question>";
		}
		
		logger.debug("Question string " + questionStr);
		return questionStr;
		
	}

	private String executeRequest(String requestUrl) {
		/*CloseableHttpClient httpclient = HttpClients.createDefault();
		StringBuffer responseBody = new StringBuffer();
		try {
			HttpGet httpget = new HttpGet(requestUrl);
			logger.debug("CAREERS REQUEST: " + requestUrl);
			CloseableHttpResponse httpResponse = httpclient.execute(httpget);

			logger.debug("Response Code : " + httpResponse.getStatusLine().getStatusCode());

			BufferedReader rd = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));

			String line = "";
			while ((line = rd.readLine()) != null) {
				responseBody.append(line);
			}
			logger.debug("CAREERS RESPONSE: " + responseBody.toString());
		} catch (Exception e) {
			logger.error("CAREERS RESPONSE Error: " + e.getMessage());
		}

		return responseBody.toString();*/
		return null;
	}
	
	
	
	/**
	 * 	PL values for Brassring XML
	 * 	Client ID = 052118
	 *  Site ID = 26207
	 *  
	 * @param questionStr
	 * @return
	 */
	private String getInputXml(String questionStr) {
		return "<Envelope version=\"01.00\">  <Sender><Id>052118</Id><Credential>26207</Credential></Sender> <TransactInfo transactId=\"1\" transactType=\"data\"><TransactId>01/27/2010</TransactId>"
				+ "<TimeStamp>12:00:00 AM</TimeStamp></TransactInfo> <Unit UnitProcessor=\"SearchAPI\"> <Packet> <PacketInfo packetType=\"data\">  <packetId>1</packetId></PacketInfo><Payload><InputString> <ClientId>26207</ClientId><SiteId>5227</SiteId>"
				+ "<PageNumber>1</PageNumber><OutputXMLFormat>2</OutputXMLFormat>  <AuthenticationToken/><HotJobs/> <ProximitySearch><Distance/> <Measurement/> <Country/><State/> <City/><zipCode/> </ProximitySearch><JobMatchCriteriaText/>"
				+ "<SelectedSearchLocaleId/> <Questions> " 
				+ questionStr
				+ "</Questions></InputString>  </Payload> </Packet>  </Unit></Envelope>";
	}
}
