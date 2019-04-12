$(document).ready(function() {

    $('#fap-button').click(function(event) {

	if (this.form.checkValidity()) {
	    fapButtonClicked();
	}

    });
});


function fapButtonClicked() {
	var target = $('#fafp-results-url').val();
	var zipCode = $('#fap-inputSearchValue').val();
	
	if(zipCode) {
		
		var url = target + "." + zipCode + ".html";
		
		location.href = url;
	}
	else {
		return;
	}

}