package com.paclife.core.servlets;

import static javax.servlet.http.HttpServletResponse.SC_OK;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.Replicator;
import com.paclife.core.util.CommonUtils;

@Component(metatype = false, label = "Update Synonym Wordlist Servlet", description = "")
@Service
@Properties({ @Property(name = "sling.servlet.methods", value = { "GET" }, propertyPrivate = true),
		@Property(name = "sling.servlet.paths", value = "/bin/updateSynonymWords", propertyPrivate = true),
		@Property(name = "sling.servlet.selectors", value = { "update", "remove", "fetchAll" }, propertyPrivate = true),
		@Property(name = "sling.servlet.extensions", value = "json", propertyPrivate = true) })
public class SynonymToolUpdaterServlet extends SlingAllMethodsServlet {

	private static final long serialVersionUID = 1L;
	private static final Logger log = LoggerFactory.getLogger(SynonymToolUpdaterServlet.class);
	private static final String UPDATE = "update";
	private static final String REMOVE = "remove";
	private static final String GET_LIST = "fetchAll";
	private static final String SUBSERVICE_NAME = "plcorpServiceUser";
	HashMap<Integer, String> hashMap = new HashMap<Integer, String>();
	String message = "";
	Boolean status = false;
	Boolean reindex = false;

	@Reference
	Replicator replicator;

	@Reference
	ResourceResolverFactory resourceResolverFactory;

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		String selectorString = request.getRequestPathInfo().getSelectorString();
		String latestList;
		String word = request.getParameter("word");
		String lineID = request.getParameter("id");
		String siteIndex = request.getParameter("index");
		String oakIndex = "/oak:index/";
		String synonymtxtIndex = "/analyzers/default/filters/Synonym/synonym.txt";
		hashMap = new HashMap<Integer, String>();
		log.info("test", "synonymtool");
		Map<String, Object> param = new HashMap<String, Object>();
		param.put(ResourceResolverFactory.SUBSERVICE, SUBSERVICE_NAME);
		try {
			ResourceResolver resolver = this.resourceResolverFactory.getServiceResourceResolver(param);
			if (siteIndex != null && siteIndex.length() > 0) {
				List<String> siteIndexList = CommonUtils.split(siteIndex);
				for (int i = 0; i < siteIndexList.size(); i++) {
					String siteIndexName = siteIndexList.get(i);
					String oakIndexPath = oakIndex + siteIndexName + synonymtxtIndex;
					// check and create index path for given siteIndex
					checkIfPathExists(oakIndex, siteIndexName, synonymtxtIndex, resolver);
					if (StringUtils.isNotBlank(selectorString)) {
						Resource stopTextFileRes = resolver.getResource(oakIndexPath);
						if (stopTextFileRes != null) {
							Node synonymTextNode = stopTextFileRes.adaptTo(Node.class);
							Session session = resolver.adaptTo(Session.class);
							BufferedReader br;
							String line;
							try {
								/*
								 * To read lines from synonym.txt file and add it into hashmap.
								 */
								InputStream in = synonymTextNode.getNode(JcrConstants.JCR_CONTENT)
										.getProperty(JcrConstants.JCR_DATA).getBinary().getStream();
								br = new BufferedReader(new InputStreamReader(in));
								int k = 1;
								hashMap = new HashMap<Integer, String>();
								while ((line = br.readLine()) != null) {
									hashMap.put(k, reformatLine(line));
									k++;
								}

								if (selectorString.equals(REMOVE) || selectorString.equals(UPDATE)) {
									if (lineID != null && lineID.length() > 0) {
										int id = Integer.parseInt(lineID);
										if (hashMap.containsKey(id)) {
											String currentText = hashMap.get(id);
											String newText = "";
											if (word != null && word.length() > 0) {
												/* line having more than one word */
												if (selectorString.equals(REMOVE) && currentText.contains(",")) {
													newText = removeWord(currentText, word);
												} else if (selectorString.equals(REMOVE)) {
													// to remove particular synonym row
													removeRow(id, currentText);
												} else if (selectorString.equals(UPDATE)) {
													newText = addWord(currentText, word);
												}
												// replace with a new text value in hashmap.
												hashMap.replace(id, currentText, newText);
											} else {
												// to remove particular synonym row
												removeRow(id, currentText);
											}

										} else {
											message = "No relevant synonym row is found for a given word.";
											status = false;
											reindex = false;
										}
									} else {
										// To add a new synonym row in hashmap with given string word
										if (selectorString.equals(UPDATE) && word != null && word.length() > 0) {
											hashMap.put(hashMap.size() + 1, reformatLine(word));
										}
										message = "Synonym row is added successfully.";
										status = true;
										reindex = true;
									}

								} else if (selectorString.equals(GET_LIST)) {
									// To return hashmap containing all the row values of synonym.txt file.
									if (hashMap.values().size() > 0) {
										message = hashMap.values().size()
												+ " synonyms wordlist are fetched successfully.";
									} else {
										message = "There are no Synonyms Words are configured for the index: cqPageLuceneCorpSearch.";

									}
									status = true;
									reindex = false;

								}
								/*
								 * To add/updates lines into synonym.txt file.
								 */
								latestList = hashMap.values().stream().collect(Collectors.joining("\n"));
								ValueFactory vf = session.getValueFactory();
								Binary binary = vf.createBinary(new ByteArrayInputStream(latestList.getBytes()));
								Node resNode = synonymTextNode.getNode(JcrConstants.JCR_CONTENT);
								resNode.setProperty(JcrConstants.JCR_DATA, binary);
								session.save();
								replicator.replicate(session, ReplicationActionType.ACTIVATE, resNode.getPath());
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
							message = "Check whether the oakIndexName has synonym words analyzer configured";
							status = false;
							reindex = false;

						}

					} else {
						message = " Selector used is Empty. Kindly Validate Once!!! ";
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
			JSONObject hashMapJsonObject = new JSONObject(hashMap);

			try {
				jsonObject.put("status", status);
				jsonObject.put("data", hashMapJsonObject);
				jsonObject.put("message", message);
				jsonObject.put("reindex", reindex);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			response.getWriter().print(jsonObject);
			response.setStatus(SC_OK);
		} catch (LoginException e) {
			log.error("Error occured while fetching service resolver ::{}", e.getMessage());
		}

	}

	/**
	 * Remove given word from string and returns string in required format.
	 * 
	 * @param allStuff     is a string of comma seperated words.
	 * @param whatToRemove is a sttring word that needs to be removed.
	 * @return String returns the string after removing given word.
	 */
	String removeWord(String allStuff, String whatToRemove) {
		boolean isWordMatches = false;
		List<String> list = new ArrayList<String>(Arrays.asList(allStuff.split(",")));
		for (String item : list) {
			if (item.trim().equals(whatToRemove)) {
				list.remove(item);
				message = "A word " + whatToRemove + " is removed successfully.";
				status = true;
				reindex = true;
				isWordMatches = true;
				break;
			}
		}
		if (!isWordMatches) {
			message = "Can not find given word  " + whatToRemove + " for this synonym row";
			status = false;
			reindex = false;
		}

		String returnString = list.stream().map(elem -> new String(elem).trim()).collect(Collectors.joining(", "));
		;
		return returnString;
	}

	/**
	 * Add given word in comma seperated string
	 * 
	 * @param allStuff     is a string of comma seperated words.
	 * @param whatToupdate is a string word that needs to be added.
	 * @return String returns the comma seperated word string.
	 */
	String addWord(String allStuff, String whatToupdate) {
		boolean isWordMatches = false;
		List<String> list = new ArrayList<String>(Arrays.asList(allStuff.split(",")));
		for (String item : list) {
			if (item.trim().equals(whatToupdate)) {
				message = "A word " + whatToupdate + " is already existed in this synonym list.";
				status = false;
				reindex = false;
				isWordMatches = true;
				break;
			}
		}
		String returnString = allStuff;
		if (!isWordMatches) {
			returnString = reformatLine(allStuff) + ", " + whatToupdate;
			message = "Word is added successfully.";
			status = true;
			reindex = true;
		}
		return returnString;
	}

	/**
	 * Reformat comma seperated string
	 * 
	 * @param line is a string of comma seperated words.
	 * @return String returns the comma seperated word string in required format.
	 */
	String reformatLine(String line) {
		String returnString = String.join(", ", CommonUtils.split(line));
		return returnString;
	}

	void removeRow(int id, String currentText) {
		hashMap.remove(id, currentText);
		message = "Synonym row is removed successfully.";
		status = true;
		reindex = true;

		// to create a new hashmap value and return response with consistent key values
		Object newhashmapValues[] = hashMap.values().toArray();
		hashMap.clear();
		int p = 1;
		for (int i = 0; i < newhashmapValues.length; i++) {
			hashMap.put(p, newhashmapValues[i].toString());
			p++;

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
			try {
				Resource resource = resolver.getResource(subIndexPath);
				Session session = resolver.adaptTo(Session.class);
				Node node = resource.adaptTo(Node.class);

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
						if (oakIndexPathList.get(i).equals("Synonym")) {
							Node synonymNode = node.getNode(oakIndexPathList.get(i));
							synonymNode.setProperty("synonyms", "synonym.txt");
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