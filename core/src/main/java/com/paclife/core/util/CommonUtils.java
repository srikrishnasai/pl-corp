package com.paclife.core.util;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CommonUtils {

	public static final Logger log = LoggerFactory.getLogger(CommonUtils.class);

	public static List<String> split(String str) {
		return Stream.of(str.split(",")).map(elem -> new String(elem).trim()).collect(Collectors.toList());
	}

	public static List<String> splitbySlash(String str) {
		return Stream.of(str.split("/")).map(elem -> new String(elem).trim()).collect(Collectors.toList());
	}

}
