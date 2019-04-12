use (function() {
	var appendWcmDisabled = false;
	var wcmmode = request.getRequestParameter('wcmmode');
	
	if(wcmmode && wcmmode == 'disabled') {
		appendWcmDisabled = true;
	}
	
	return appendWcmDisabled;
});