package com.paclife.core.servlets;

import static javax.servlet.http.HttpServletResponse.SC_OK;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import javax.jcr.ValueFormatException;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.Replicator;
import com.paclife.core.util.CommonUtils;

@Component(metatype = false, label = "Add/Remove Stop Words Servlet", description = "")
@Service
@Properties({ @Property(name = "sling.servlet.methods", value = { "GET" }, propertyPrivate = true),
		@Property(name = "sling.servlet.paths", value = "/bin/addOrRemoveStopWords", propertyPrivate = true),
		@Property(name = "sling.servlet.selectors", value = { "update", "remove", "fetchAll",
				"reindex" }, propertyPrivate = true),
		@Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true) })
public class StopWordUpdaterServlet extends SlingAllMethodsServlet {

	private static final long serialVersionUID = 1L;
	private static final Logger log = LoggerFactory.getLogger(StopWordUpdaterServlet.class);
	private static final String UPDATE = "update";
	private static final String REMOVE = "remove";
	private static final String GET_LIST = "fetchAll";
	private static final String REINDEX = "reindex";
	private static final String SUBSERVICE_NAME = "plcorpServiceUser";

	@Reference
	Replicator replicator;

	@Reference
	ResourceResolverFactory resourceResolverFactory;

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		String word = request.getParameter("word");
		String siteIndex = request.getParameter("index");
		String selectorString = request.getRequestPathInfo().getSelectorString();
		List<String> wordsList = new ArrayList<String>();
		String latestList;
		String message = "";
		Boolean status = false;
		Boolean reindex = false;
		String oakIndex = "/oak:index/";
		String stopTxtIndex = "/analyzers/default/filters/Stop/stop.txt";
		Map<String, Object> param = new HashMap<String, Object>();
		param.put(ResourceResolverFactory.SUBSERVICE, SUBSERVICE_NAME);
		try {
			ResourceResolver resolver = this.resourceResolverFactory.getServiceResourceResolver(param);
			if (siteIndex != null && siteIndex.length() > 0) {
				List<String> siteIndexList = CommonUtils.split(siteIndex);
				for (int i = 0; i < siteIndexList.size(); i++) {
					String siteIndexName = siteIndexList.get(i);
					String oakIndexPath = oakIndex + siteIndexName + stopTxtIndex;
					String reIndexPath = oakIndex + siteIndexName;
					// check and create index path for given siteIndex
					checkIfPathExists(oakIndex, siteIndexName, stopTxtIndex, resolver);
					if (StringUtils.isNotBlank(word) || StringUtils.isNotBlank(selectorString)) {
						Resource stopTextFileRes = resolver.getResource(oakIndexPath);
						Resource reIndexPathRes = resolver.getResource(reIndexPath);
						Session session = resolver.adaptTo(Session.class);
						if (reIndexPathRes != null && selectorString.equals(REINDEX)) {
							ModifiableValueMap map = reIndexPathRes.adaptTo(ModifiableValueMap.class);
							map.put("reindex", true);
							reindex = false;
							status = true;
							reIndexPathRes.getResourceResolver().commit();
							try {
								replicator.replicate(session, ReplicationActionType.ACTIVATE, reIndexPath);
								message = "Re-Indexing is done successfully!";
							} catch (ReplicationException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
						} else if (stopTextFileRes != null && !selectorString.equals(REINDEX)) {
							Node stopTextNode = stopTextFileRes.adaptTo(Node.class);
							StringBuilder sb = new StringBuilder();
							BufferedReader br;
							String line;
							try {
								InputStream in = stopTextNode.getNode(JcrConstants.JCR_CONTENT)
										.getProperty(JcrConstants.JCR_DATA).getBinary().getStream();
								br = new BufferedReader(new InputStreamReader(in));
								wordsList = new ArrayList<String>();
								while ((line = br.readLine()) != null) {
									wordsList.add(line);
								}
								boolean wordExists = wordsList.contains(word);
								if (selectorString.equals(UPDATE)) {
									if (wordExists) {
										message = word + " already exists!!";
										status = false;
										reindex = false;
									} else {
										wordsList.add(word);
										message = word + " is added successfully.";
										status = true;
										reindex = true;
									}
								} else if (selectorString.equals(REMOVE)) {
									if (!wordExists) {
										message = word + " does not exist!!";
										status = false;
										reindex = false;
									} else {
										wordsList.remove(word);
										message = word + " is removed successfully.";
										status = true;
										reindex = true;

									}
								} else if (selectorString.equals(GET_LIST)) {
									if (wordsList.size() > 0) {
										message = wordsList.size() + " words are fetched successfully.";
									} else {
										message = "There are no Stop Words are configured for the index: cqPageLuceneCorpSearch.";
									}
									status = true;
									reindex = false;

								}
								latestList = wordsList.stream().collect(Collectors.joining("\n"));
								ValueFactory vf = session.getValueFactory();
								Binary binary = vf.createBinary(new ByteArrayInputStream(latestList.getBytes()));
								Node resNode = stopTextNode.getNode(JcrConstants.JCR_CONTENT);
								resNode.setProperty(JcrConstants.JCR_DATA, binary);
								session.save();
								replicator.replicate(session, ReplicationActionType.ACTIVATE, stopTextNode.getPath());
								log.info("Added the entered Stop words to the list and replicated ::{}", sb.toString());
							} catch (ValueFormatException e) {
								log.error("Value Format Exception ::{}", e.getMessage());
							} catch (PathNotFoundException e) {
								log.error("Path Not Found Exception ::{}", e.getMessage());
							} catch (RepositoryException e) {
								log.error("Repository Exception ::{}", e.getMessage());
							} catch (ReplicationException e) {
								log.error("Replication Exception ::{}", e.getMessage());
							}
						} else {
							message = "Check whether the oakIndexName has stop words analyzer configured";
							status = false;
							reindex = false;

						}

					} else {
						message = "Either the words to update/add list or selector used is Empty. Kindly Validate Once!!! ";
						status = false;
						reindex = false;

					}

				}
			} else {
				message = "Index is empty. Kindly Validate Once!!! ";
				status = false;
				reindex = false;
			}
			JSONObject jsonObject = new JSONObject();
			JSONArray jsonArray = new JSONArray(wordsList);
			try {
				jsonObject.put("status", status);
				jsonObject.put("data", jsonArray);
				jsonObject.put("message", message);
				jsonObject.put("reindex", reindex);
			} catch (JSONException e) {
				e.printStackTrace();
			}

			response.getWriter().print(jsonObject);
			response.setStatus(SC_OK);
		} catch (LoginException e) {
			log.error("Error occured while fetching service resolver ::{}", e.getMessage());
		}
	}

	/**
	 * Create stop.txt file path if not existed.
	 * 
	 * @param oakIndexPath    is a root path of index.
	 * @param siteIndexPath   is a requestedIndex path.
	 * @param stopTxtfilePath is an exact path for stop.txt file.
	 */
	void checkIfPathExists(String oakIndexPath, String siteIndexPath, String stopTxtfilePath,
			ResourceResolver resolver) {
		List<String> oakIndexPathList = CommonUtils.splitbySlash(stopTxtfilePath);
		String subIndexPath = oakIndexPath + siteIndexPath;
		for (int i = 0; i < oakIndexPathList.size(); i++) {
			log.info("subIndexPath1::{}", subIndexPath);
			Resource resource = resolver.getResource(subIndexPath);
			Session session = resolver.adaptTo(Session.class);
			Node node = resource.adaptTo(Node.class);
			try {
				/* create a node if not present at given path */
				if (!node.hasNode(oakIndexPathList.get(i))) {
					/* add requires node and properties for txt file path */
					if (oakIndexPathList.get(i).contains(".txt")) {
						ValueFactory vf = session.getValueFactory();
						String list = "";
						Binary binary = vf.createBinary(new ByteArrayInputStream(list.getBytes()));
						Node fileNode = node.addNode(oakIndexPathList.get(i), JcrConstants.NT_FILE);
						fileNode.addNode("jcr:content", JcrConstants.NT_RESOURCE).setProperty(JcrConstants.JCR_DATA,
								binary);

					} else {
						node.addNode(oakIndexPathList.get(i), JcrConstants.NT_UNSTRUCTURED);
						if (oakIndexPathList.get(i).equals("Stop")) {
							Node stopNode = node.getNode(oakIndexPathList.get(i));
							stopNode.setProperty("words", "stop.txt");
						}

					}
					session.save();
				}
				/* appending next path of string */
				subIndexPath = subIndexPath + "/" + oakIndexPathList.get(i);
			} catch (Exception e) {
				log.info("node_Exception::{}", e);
				e.printStackTrace();
			}
		}

	}
}
