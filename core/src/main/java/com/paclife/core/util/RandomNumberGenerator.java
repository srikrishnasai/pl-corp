package com.paclife.core.util;

import java.util.Random;

import com.adobe.cq.sightly.WCMUsePojo;

public class RandomNumberGenerator extends WCMUsePojo {

	private String randomNumber;

	@Override
	public void activate() {
		Random rnd = new Random();
        int number = rnd.nextInt(999999);
        
        this.randomNumber = String.format("%06d", number);
	}

	public String getRandomNumber() {
		return randomNumber;
	}
}
