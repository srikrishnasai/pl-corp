package com.paclife.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Dictionary;
import java.util.stream.Collectors;

import javax.servlet.ServletException;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Modified;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.paclife.core.util.CloudManagerNotificationUtil;

/**
 * 
 * This Servlet acts as a Webhook to receive updates from cloud manager events.
 * 
 * @author Krishna
 *
 */
@Component(metatype = true, immediate = true, label = "CloudManager Notification Servlet", description = "")
@Service
@Properties({ @Property(name = "sling.servlet.methods", value = { "GET", "POST" }, propertyPrivate = true),
		@Property(name = "sling.core.servletName", value = {
				"CloudManager Notification Servlet" }, propertyPrivate = true),
		@Property(name = "sling.servlet.paths", value = "/bin/pacificlife/cmnotification", propertyPrivate = true) })
public class CloudManagerNotificationServlet extends SlingAllMethodsServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Logger logger = LoggerFactory.getLogger(this.getClass());

	@Property(label = "Organization ID", propertyPrivate = false, description = "Organization ID")
	private static final String ORGANIZATION_ID = "organization_id";
	private String organizationId;

	@Property(label = "Technical Account Email", propertyPrivate = false, description = "Technical Account Email")
	private static final String TECHNICAL_ACCOUNT_EMAIL = "technical_account_email";
	private String technicalAccountEmail;

	@Property(label = "Technical Account ID", propertyPrivate = false, description = "Technical Account ID")
	private static final String TECHNICAL_ACCOUNT_ID = "technical_account_id";
	private String technicalAccountId;

	@Property(label = "API Key", propertyPrivate = false, description = "API Key")
	private static final String API_KEY = "api_key";
	private String apiKey;

	@Property(label = "Private Key Path", propertyPrivate = false, description = "Private Key Path")
	private static final String PRIVATE_KEY_PATH = "private_key_path";
	private String privateKeyPath;

	@Property(label = "Client Secret", propertyPrivate = false, description = "Client Secret")
	private static final String CLIENT_SECRET = "client_secret";
	private String clientSecret;

	@Property(label = "Teams Webhook", propertyPrivate = false, description = "Teams Webhook")
	private static final String TEAMS_WEBHOOK = "teams_webhook";
	private String teamsWebhook;

	@Property(label = "Auth Server", propertyPrivate = false, description = "Auth Server")
	private static final String AUTH_SERVER = "auth_server";
	private String authServer;

	Dictionary<?, ?> props;

	/**
	 * To verify the challenge from request.
	 */
	@Override
	protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {
		logger.debug("Inside doGet Method of Cloud Manager Servlet");
		resp.setContentType("application/text");
		PrintWriter writer = resp.getWriter();
		String challenge = "";
		try {
			challenge = CloudManagerNotificationUtil.getParamValue(req.getRequestURI() + "?" + req.getQueryString(),
					"challenge");
		} catch (URISyntaxException e) {
			logger.error("Error Occured while verifying Signature ::{}", e.getMessage());
		}
		if (!challenge.equals("")) {
			writer.print(challenge);
		} else {
			resp.sendError(400);
		}

	}

	/**
	 * Takes event data and clears Imperva Cache if pipeline execution ended.
	 */
	@Override
	protected void doPost(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {
		logger.debug("Inside doPost Method of Cloud Manager Servlet");
		resp.setContentType("application/text");
		PrintWriter printWriter = resp.getWriter();
		printWriter.print("Request Received");
		logger.debug("Request Received from cloudmanager event handler.");
		String STARTED = "https://ns.adobe.com/experience/cloudmanager/event/started";
		String ENDED = "https://ns.adobe.com/experience/cloudmanager/event/ended";
		String EXECUTION = "https://ns.adobe.com/experience/cloudmanager/pipeline-execution";

		try {

			String requestData = req.getReader().lines().collect(Collectors.joining());
			CloudManagerNotificationUtil.verifySignature(requestData, req.getHeader("x-adobe-signature"), props);
			logger.debug("Signature Verified Successfully.");
			JsonElement jelement = new JsonParser().parse(requestData);
			JsonObject jobject = jelement.getAsJsonObject();

			String eventType = jobject.get("event").getAsJsonObject().get("@type").getAsString();
			String executionType = jobject.get("event").getAsJsonObject().get("xdmEventEnvelope:objectType")
					.getAsString();

			if ((ENDED.equals(eventType) || STARTED.equals(eventType)) && EXECUTION.equals(executionType)) {
				//
				String executionUrl = jobject.get("event").getAsJsonObject().get("activitystreams:object")
						.getAsJsonObject().get("@id").getAsString();
				logger.debug("Execution Url ::{}", executionUrl);
				String executionResponse = CloudManagerNotificationUtil
						.makeApiCall(CloudManagerNotificationUtil.getAccessToken(props), executionUrl, props);

				JsonElement jelementer = new JsonParser().parse(executionResponse);
				JsonObject jobjecter = jelementer.getAsJsonObject();

				String pipelineurl = jobjecter.get("_links").getAsJsonObject()
						.get("http://ns.adobe.com/adobecloud/rel/pipeline").getAsJsonObject().get("href").getAsString();
				logger.debug("PipeLine Url ::{}", pipelineurl);
				URI uri = new URL(executionUrl).toURI();

				String pipelineResponse = CloudManagerNotificationUtil.makeApiCall(
						CloudManagerNotificationUtil.getAccessToken(props), uri.resolve(pipelineurl).toURL().toString(),
						props);
				logger.debug("Pipeline Response ::{}", pipelineResponse);
				JsonElement jelementpipeline = new JsonParser().parse(pipelineResponse);
				JsonObject jobjectpipeline = jelementpipeline.getAsJsonObject();

				CloudManagerNotificationUtil
						.notifyTeams(jobjectpipeline.get("name").getAsString() + " Pipeline has been started", props);
				logger.debug("Notification Successfully sent to channel..");
			}

		} catch (Exception e) {
			logger.error("Error Occured ::{}", e.getMessage());
			resp.sendError(500);
		}
	}

	@Activate
	@Modified
	public void activate(ComponentContext ctx) {
		this.props = ctx.getProperties();
		this.apiKey = PropertiesUtil.toString(props.get(API_KEY), "");
		this.authServer = PropertiesUtil.toString(props.get(AUTH_SERVER), "");
		this.clientSecret = PropertiesUtil.toString(props.get(CLIENT_SECRET), "");
		this.organizationId = PropertiesUtil.toString(props.get(ORGANIZATION_ID), "");
		this.privateKeyPath = PropertiesUtil.toString(props.get(PRIVATE_KEY_PATH), "");
		this.teamsWebhook = PropertiesUtil.toString(props.get(TEAMS_WEBHOOK), "");
		this.technicalAccountEmail = PropertiesUtil.toString(props.get(TECHNICAL_ACCOUNT_EMAIL), "");
		this.technicalAccountId = PropertiesUtil.toString(props.get(TECHNICAL_ACCOUNT_ID), "");
	}

}
