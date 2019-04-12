$(function() {
    
    
    $('#careers-submit').click(function(){
	event.preventDefault();
	var keywordInput = $('#keyword-field').val();
	var locationInput = $('#location-field').val();
	    $.get("/bin/pacificlife/proxy", {keyword: keywordInput, location: locationInput},  function(data){
		
		//If empty string, Redirect to Brassring Home page 
		if (!data) {
		    window.location.href = "https://sjobs.brassring.com/TGnewUI/Search/Home/Home?partnerid=26207&siteid=5227#home";
		}
		else {
		    
		    	var xml = data, 
		    	xmlDoc = $.parseXML(xml), 
		    	$xml = $(xmlDoc), 
		    	$link = $xml.find("Link");

		    	var brassUrl = $link.text().replace(/&amp;/g, "&");

		    	console.log("Redirect to " + brassUrl);

		    	window.location.href = brassUrl;
		    }

	    });
    });


});