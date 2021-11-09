$(function() {

	// var someElement= document.getElementById("myElement");
	// someElement.className += " newclass";
	
	
	$('.page-link').click(function(e) {
		e.preventDefault();
		var $form = $('#pl-search-form');
		var input= $("<input>").attr("type", "hidden").attr("name", "offset").val($(this).data('offsetValue'));
		$form.append($(input));
		$form.submit();
	});
	
	$('#pl-search-form').submit(function(e) {
	   // e.preventDefault();
	});
	
	$.each($('.pl-search-result-link'), function() {
		$(this).text(location.origin + $(this).text());
	});	
	
	$('.paginationPages').click(function(e){		
		var pageLimit = e.currentTarget.id;	
		var url = new URL(window.location.href);
		var search_params = url.searchParams;
		search_params.set('noOfResPerPage', pageLimit);		
		window.location.search = search_params.toString();		
	});
	

	(function(name) {
		var container = $('#pagination-' + name);	
		var searchParams = new URLSearchParams(window.location.search);
		var defaultOffset = searchParams.get("offset") || 0;	
		var setPageLimit = searchParams.get("noOfResPerPage") || 10;			
		
		if($("#paginationLast").val()) {
			var number = $("#paginationLast").val() - 1;			
			var total = number*setPageLimit;
			var arr = Array.apply(null, Array(total)).map(function(u, i){
				return i+1;
			});							
			container.pagination({
				dataSource: arr,
				pageSize: setPageLimit,
				pageNumber: (defaultOffset / setPageLimit) + 1,			
				prevText: '<',
				nextText: '>',
				afterGoButtonOnClick: function(data, pagination) {
					if ('URLSearchParams' in window) {
											
						var offset = (pagination - 1) * setPageLimit ;
						searchParams.set("offset", offset);    				
						window.location.search = searchParams.toString();
					}
				},
				afterPageOnClick: function(data, pagination) {
					if ('URLSearchParams' in window) {										
						var offset = (pagination - 1) * setPageLimit ;
						searchParams.set("offset", offset);    				
						window.location.search = searchParams.toString();
					}
				},
				afterPreviousOnClick: function(data, pagination) {
					if ('URLSearchParams' in window) {										
						var offset = (pagination - 1) * setPageLimit ;
						searchParams.set("offset", offset);					
						window.location.search = searchParams.toString();
					}
				},
				beforeNextOnClick: function(data, pagination) {
					if ('URLSearchParams' in window) {										
						var offset = (pagination - 1) * setPageLimit ;
						searchParams.set("offset", offset);				
						window.location.search = searchParams.toString();
					}
				}
			})
		}
	  })('items');
		
	 
	$( document ).ready(function(e) {	
		
		var searchParams = new URLSearchParams(window.location.search);
		var setActiveClass = searchParams.get("noOfResPerPage");			

		if(setActiveClass === null){
			$("#10").addClass("active");
		}
		
		if(setActiveClass === "10"){
			$("#10").addClass("active");
		}
		if(setActiveClass === "5"){
			$("#5").addClass("active");
		}
		if(setActiveClass === "25"){
			$("#25").addClass("active");
		}
		if(setActiveClass === "50"){
			$("#50").addClass("active");
		}
		
	});
});