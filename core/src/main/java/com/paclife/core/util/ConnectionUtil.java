package com.paclife.core.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Code Scan Remediation
import java.net.SocketTimeoutException;



public class ConnectionUtil {
	public static final String OSB_DEV_URL = "http://soa.amf.pacificlife.net:6101/soaqa/Services/";
	   
	public static final String OSB_QA_URL = "http://anmvbus1:9103/Services/";
	public static final String OSB_PROD_URL = "http://esb.amfsoa.pacificlife.com/Services/";
	public static final Logger log = LoggerFactory.getLogger(ConnectionUtil.class);

	public static String getResponseString(String urlString){
		URL url;
		StringBuffer response = new StringBuffer("");
		try {
			url = new URL(urlString);
			InputStream stream = null;
			try {
				URLConnection conn = url.openConnection();
				
				// Code Scan Remediation
				// Set timeout (critical issue requirement)
				conn.setConnectTimeout(60 * 1000); // x * 1000 = x seconds
				
				stream = conn.getInputStream();
				if(log.isDebugEnabled()){
					log.debug("GSAConnectionUtil: URL connect Stream for"+urlString);
				}
				//put output stream into a string
				BufferedReader br = new BufferedReader(new InputStreamReader(stream));
				//,Charset.forName("ISO-8859-1")));
				
				String line;
		        while ((line = br.readLine()) != null) {
		        	response.append(line);
		        	response.append('\n');
		        }
				if(log.isDebugEnabled()){
					log.debug("GSAConnectionUtil: response: "+response.toString());
					log.debug("GSAConnectionUtil: Payload size: "+response.length());
				}

		        br.close();
			
			 // Code Scan Remediation
			} catch (SocketTimeoutException e) {
				log.error("getResponseString SocketTimeoutException",e);
				e.printStackTrace();	
				// Remediation END 
			} catch (IOException e) {
				// TODO Auto-generated catch block
				log.error("getResponseString IOException",e);
				e.printStackTrace();
			} finally {
				if(stream != null) { 
					try{ 
						stream.close();
					} catch(Exception e){
						log.error( "Stream Close Exception",e);
					}
				}
			}
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			log.error("MalformedURLException", e);
			e.printStackTrace();
		}
		return response.toString();
	}
	public static String getOSBUrl(SlingHttpServletRequest slingRequest){
		String requestHost = getRequestHost(slingRequest);
		log.debug("SiteUtils","getOSBUrl", "---->getOSBUrl ::" + requestHost);
		if(StringUtils.contains(requestHost, "test") || StringUtils.contains(requestHost, "dev")
			 || StringUtils.contains(requestHost, "dcorp")){
			log.debug("SiteUtils","getOSBUrl","---->getOSBUrl 1" );
			return OSB_DEV_URL;
		}else if(StringUtils.contains(requestHost, "modeloffice") 
				|| StringUtils.contains(requestHost, "mo") ||  StringUtils.contains(requestHost, "prdauthor")){
			log.debug("SiteUtils","getOSBUrl","---->getOSBUrl 2" );
			return OSB_QA_URL;
		} 
		log.debug("SiteUtils","getOSBUrl","---->getOSBUrl 3" );
		return OSB_PROD_URL;
	}
	public static String getRequestHost(SlingHttpServletRequest slingRequest){
	    String reqHost = null;
	    if (slingRequest != null) {
	      reqHost = slingRequest.getHeader("Referer");
	      if (reqHost == null || reqHost.length() <= 0) 
	        reqHost = slingRequest.getHeader("Host");
	    }
	    return reqHost;
	}
}