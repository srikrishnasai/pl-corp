package com.paclife.core.servlets;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.security.GeneralSecurityException;
import java.security.cert.X509Certificate;
import java.security.cert.CertificateException;
import java.util.Optional;
import java.util.logging.Logger;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.ServletException;

import org.apache.commons.io.IOUtils;
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

import org.apache.jackrabbit.commons.json.JsonHandler;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

//OSGi Required for Servlets
//import org.apache.sling.api.servlets.HttpConstants;

import com.google.common.io.Files;


// Code Scan Remediation
import java.net.SocketTimeoutException;

//OSGI Annotation Declaration R7 Format
/*@Component(name = "Find an Advisor (DEV)", service={},
				property = {"sling.servlet.methods= " + HttpConstants.METHOD_POST,
								"sling.servlet.paths"= + "/bin/findadvisor/geolocation_dev",
								"sling.servlet.extensions=" + "json"})
 @ServiceDescription("DEV helper for testing Fafp")*/


@SuppressWarnings("serial")
@Component(metatype = false, label = "Find an Advisor (DEV)", description = "DEV helper for testing Fafp")
@Service
@Properties({
    @Property(name = "sling.servlet.methods", value = {"POST"}, propertyPrivate = true),
    @Property(name = "sling.servlet.paths", value = "/bin/findadvisor/geolocation_dev", propertyPrivate = true),
    @Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true)
})
public class FindAdvisorDevHelper extends SlingAllMethodsServlet {

	private static final Logger logger = Logger.getLogger(FindAdvisorDevHelper.class.getName());
	
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		doPost(request,response);
	}
	@Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		Double latitude = Double.parseDouble(request.getParameter("latitude"));
		Double longitude = Double.parseDouble(request.getParameter("longitude"));
		String query = StringUtils.stripToEmpty( request.getParameter("query"));
		Integer radius = Optional.ofNullable(request.getParameter("radius")).map(Integer::parseInt).orElse(250);
		
		doQuery(out, latitude, longitude, query, radius);
	}
	
	private static void doQuery(PrintWriter out, Double latitude, Double longitude, String query, Integer radius)
			throws UnsupportedEncodingException, IOException, MalformedURLException {

		
		try {
			Thread.sleep(3000); // simulate production performance levels, to allow testing the progress icon
		} catch (InterruptedException e1) {
			// Code Scan Remediation
			Thread.currentThread().interrupt();  // set interrupt flag
			logger.info("Interrupt Exception: " + e1);
		}
		
		if(StringUtils.isEmpty(query)) {
            query = "DEFAULT";
        }
		
		query = query.replaceAll("[^A-Za-z0-9\\,]", ""); 
		query = URLEncoder.encode(query,"UTF-8");
		
		File cacheFile = new File(new File(System.getProperty("java.io.tmpdir")), latitude + "-" + longitude + "-" + radius + ".cache.json");
		if(cacheFile.exists()) {
			out.write(Files.toString(cacheFile, Charset.defaultCharset()));
			out.flush();
			logger.info("Using data from cache: " + cacheFile);
			return;
		}
		
		String url = String.format("https://www.pacificlife.com/bin/findadvisor/geolocation?latitude=%f&longitude=%f&query=%s&time=%d&radius=%d",
				latitude, longitude, query, System.currentTimeMillis(), radius);

		logger.info("Requesting data from URL = " + url);
		
		unsecure();
		
		// Code Scan Remediation
		// Nesting the openConnection within  a try catch
		try {
			URLConnection uc = new URL(url).openConnection();
			
			// Code Scan Remediation
			// Set timeout (critical issue requirement)
			uc.setConnectTimeout(60 * 1000); // x * 1000 = x seconds
			uc.setReadTimeout(60 * 1000);
			
			uc.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36");
			uc.setRequestProperty("Cookie", "visid_incap_1215848=TBNbi008Sny51zJDWHpaSgJi6loAAAAAQkIPAAAAAACAa3uFAWNK2HMG4kWVntq9SJUonxBfq94m; incap_ses_340_1215848=EVe2OkzM7gr6OU7S3Oy3BAj7SFsAAAAAPVemsru68AAiUfyXezsmkQ==; incap_ses_415_1215848=yToqcZkE2HrEYH9Uv2HCBQP9SFsAAAAAydfOlAyqCqq2zTGE7U5KOw==");
			uc.setDoOutput(true);
			uc.setDoInput(true);

			try(InputStream is = uc.getInputStream()) {
				
				String json = IOUtils.toString(is);
				org.apache.commons.io.IOUtils.write(json, out);
				out.flush();			

				if(!json.startsWith("[{")) {
					throw new IllegalArgumentException();
				}
				Files.write(json, cacheFile, Charset.defaultCharset());

			}
		// Code Scan Remediation
		} catch (SocketTimeoutException e) {
			logger.info("getResponseString SocketTimeoutException" + e);
			e.printStackTrace();	
		// Remediation END
		}
	}
	
	public static void main(String[] args) {
		try(PrintWriter out = new PrintWriter(System.out)) {
			doQuery(out, 33.6297, -117.872, "", 250);
		} catch (UnsupportedEncodingException e) {
            logger.info("main UnsupportedEncodingException" + e);
			e.printStackTrace();	
        } catch (MalformedURLException e) {
            logger.info("main MalformedURLException" + e);
			e.printStackTrace();	
        } catch (IOException e) {
            logger.info("main IOException" + e);
			e.printStackTrace();	
        }
	}

	private static void unsecure() {
		TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
			public java.security.cert.X509Certificate[] getAcceptedIssuers() {
				return new X509Certificate[0];
			}

			public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) throws CertificateException  {
				// Empty Method - SonarQube Remediation
			}

			public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) throws CertificateException  {
				// Empty Method - SonarQube Remediation
			}
		} };

		try {
			// SonarQube update SSLContext to a compliant protocol. Original: "SSL"
			SSLContext sc = SSLContext.getInstance("TLSv1.2", "SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
		} catch (GeneralSecurityException e) {
			logger.info("unsecure GeneralSecurityException" + e);
			e.printStackTrace();	
		}
	}

	private static final class NullParser implements JsonHandler {
		@Override
		public void value(double arg0) throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void value(long arg0) throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void value(boolean arg0) throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void value(String arg0) throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void object() throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void key(String arg0) throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void endObject() throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void endArray() throws IOException {
			// Empty Method - SonarQube Remediation
		}

		@Override
		public void array() throws IOException {
			// Empty Method - SonarQube Remediation
		}
	}
}