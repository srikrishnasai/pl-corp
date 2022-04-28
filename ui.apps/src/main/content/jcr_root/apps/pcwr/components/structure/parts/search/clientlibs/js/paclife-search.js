
var searchFinalText = "";
var itemPerPageLimit = 10;

//Excute when function serach from differet page 
$(function() {
	var PacLifeSearch = function() {
		this.getResults = function(searchText) {
			doAjaxSeach(searchText,10,0,true,1);	
		}
	}
	window.PacLife.Search = new PacLifeSearch();
});

$( document ).ready(function(e) {	
	hasSearchClass =document.getElementsByClassName('search-results-page');
    hasSearchClass = hasSearchClass.length;
	if(hasSearchClass > 0){
		var searchParams = new URLSearchParams(window.location.search);
		var setPageLimit = searchParams.get("noOfResPerPage") || "10";
		var defaultOffset = searchParams.get("offset") || "0";
		var text = searchParams.get("q");
		if(text === "" || text === null){
			$('#shimmer-container-Search').addClass('d-none');
			$(".search-page-wrapper-no-results").removeClass('d-none');
		}
		else{
			doAjaxSeach(text,setPageLimit,defaultOffset,true,1);
			if(setPageLimit === null){
				$("#10").addClass("active");
			}
			else{
				setActiveItem(setPageLimit);
			}
		}
	}
});

//Excute when user clicks on paginationPages
$('.paginationPages').click(function(e){
	var pageLimit = e.currentTarget.id;	
	var text = searchFinalText;
	$('.search-page-wrapper').addClass('search-display-none');
	$('.search-page-wrapper').removeClass('search-display-block');
	$('.pagination-wrapper').addClass('d-none');
	$('#shimmer-container-Search').removeClass('d-none');
	if (history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q='+text+'&offset=0&noOfResPerPage='+pageLimit;
		window.history.pushState({path:newurl},'',newurl);
	}	
	doAjaxSeach(text,pageLimit,0,true,1);
	var width  = $(window).width();    
	var searchBarDesktop = 1139;
	if(width < searchBarDesktop){
		var result = $('.search-nav-close-icon').hasClass('collapsed');
		if (!result) {
			$('.search-nav-close-icon').click();
		}
	}
	else{
		var hasShowClass = $('#searchNavCollapse').hasClass('show');
		if(hasShowClass){
			$('.showNavbar').click();
		}
	}

	window.scrollTo({ top: 100, behavior: 'smooth' });	
});

/**
 * @description - Will Generate the search with the related word 
 * @param {String} text - Text for the search
 * @param {Number} setPageLimit - refer to the item per page
 * @param {Number} defaultOffset - refer to the offset of the page
 * @param {Boolean} flag - refer whether pagination function should call or not
 * @param {Number} pageNumber - refer the the current page number 
 */


//execute go get the results for search
function doAjaxSeach(text,setPageLimit,defaultOffset,flag,pageNumber){
	var textSearch;
	searchFinalText=text;
	itemPerPageLimit=setPageLimit;
	$('#shimmer-container-Search').removeClass('d-none');
	$('.search-page-wrapper').addClass('search-display-none');
	$('.search-page-wrapper').removeClass('search-display-block');
	$('.pagination-wrapper').addClass('d-none');
	$('.search-page-wrapper').removeClass('transition-search');
	var path = $('#UrlEndpoint').val();
	if(text === "" || text === undefined){
		$('#shimmer-container-Search').addClass('d-none');
		$(".search-page-wrapper-no-results").removeClass('d-none');
	}
	else{
		textSearch=text.trim();
		searchFinalText=textSearch;
		$.ajax({ 
			type: 'GET', 
			url: path +".json",
			data: {q : textSearch, offset : defaultOffset , noOfResPerPage : setPageLimit},
			success: function (data) {
				var searchResults = data ;
				var totalResult = searchResults.resultTotal;
				var startRange = searchResults.rangeStart;
				var endRange = searchResults.rangeEnd;
				var resultData = searchResults.results;	
		
				if(parseInt(totalResult) <= 0 ){
					$('#shimmer-container-Search').addClass('d-none');
					$(".search-page-wrapper-no-results").removeClass('d-none');
				}
				else{
					$('.search-page-wrapper').removeClass('search-display-none');
					$('.search-page-wrapper').addClass('search-display-block');
					setTimeout(function () {  
						$('#shimmer-container-Search').addClass('d-none');
						$('.search-page-wrapper').addClass('transition-search');
					},100)
					$('.pagination-wrapper').removeClass('d-none');
					$('#shimmer-container-Search').addClass('d-none');
					$(".search-page-wrapper-no-results").addClass('d-none');
					// Will set the information paragraph 
					var infoparagraph = '<p class="search-results-page-subtitle mt-2 mb-4 mx-auto" data-total-result="'+totalResult+'">'
										+'Showing '+startRange+'  - '+endRange+'  of '+totalResult+' results found for "'+textSearch+'"'
										+'</p> ';
					$('.info-wrapper-result').empty();
					$('.info-wrapper-result').append(infoparagraph);
					var searchResultData = '';
					var searchResultDataList = [];
					description="";
					readmore = "";
					link ="";
					searchResultDataFinal = "";
					//Will set the search results
					for(var i=0;i<resultData.length;i++){
							readmore = "";
							link ="";
							searchResultData="";
							if(resultData[i].contentType === 'page'){
								searchResultData= '<div class="search-result">'
								+'<a href="'+resultData[i].fixedUrl+'" class="DTM-TAG-search-result-link" data-search-page="'+pageNumber+'" data-search-position="="'+i+'" >'				
								+'<h6> <span class="search-results-index-title">'+resultData[i].title+'</span></h6>'
								+'<div class="p-alt-16 show-read-more">'+resultData[i].description+'</div></a>';
								if(resultData[i].description.length > 300){
									readmore = '<div class="read-more readDesc">READ MORE ></div>'
								}
								link = '<span class="pl-search-result-link">'+location.origin+resultData[i].fixedUrl+'</span>'
								+'</a></div>';
							}
							else{
								searchResultData= '<div class="search-result">'
								+'<a href="'+resultData[i].fixedUrl+'" class="DTM-TAG-search-result-link searchResultPdf " data-search-page="'+pageNumber+'" data-search-position="'+i+'" target="_blank" type="application/pdf" style="position:relative;">'	
									+'<div class="pdf-img-wrapper">'
										+'<div class="v-tooltip modifier--content-right-bottom modifier--visible pdf-view">'
											+'<div class="v-tooltip__wrap">'
												+'<img src='+resultData[i].thumbnailWebPreview+' class="v-tooltip__desc"/>'
											+'</div>'
										+'</div>'
									+'<img src="'+resultData[i].thumbnail+'" class="thumbnail-wrapper"/>'
									+'</div>'
									+'<div class="search-title-wrapper">'
										+'<h6> <span class="search-results-index-title">'+resultData[i].title+'</span></h6>'
										+'<div class="p-alt-16 show-read-more">'+resultData[i].description+'</div>'
									+'</div>'
								+'</a>';
								if(resultData[i].description.length > 300){
								 	readmore = '<div class="read-more readDesc">READ MORE ></div>';
								}
                                link = '<span class="pl-search-result-link-pdf pl-search-result-link" style="margin-top:10px;">'+location.origin+resultData[i].fixedUrl+'</span>'
                                +'</div>';
                            }
							searchResultDataFinal = searchResultData + readmore;
							searchResultDataList.push(searchResultDataFinal);
					}
					$('.container-search-items').empty();
					$('.container-search-items').append(searchResultDataList);

					//It will hide the pagination-wrapper if results are < 10
					if(totalResult < 10 ){
						$('.pagination-wrapper').addClass('d-none');
					}
					else{
					   $('.pagination-wrapper').removeClass('d-none');
				   }

				   //Will call the pagination function at time time of pageload or at the time of search
					if(flag === true){
						pagination('items',totalResult);
					}

					//Will call the function to set the active class for pagination-wrapper
					setActiveItem(setPageLimit.toString());


					$(".read-more").click(function(e){						
						e.preventDefault();
						if($(this).text() == 'READ MORE >'){
							$(this).siblings('.DTM-TAG-search-result-link').find(".show-read-more").addClass('height-auto');
							$(this).text('READ LESS >');
						}
						else{
							$(this).siblings('.DTM-TAG-search-result-link').find(".show-read-more").removeClass('height-auto');
							$(this).text('READ MORE >');
						}
						
					});
					
					$('.pl-search-result-link').click(function (e) { 
						e.preventDefault();
						window.location.href = $(this).text();
					
						
					});
					
					
					window.digitalData.page.onsiteSearchResult = totalResult;
					window.digitalData.page.onsiteSearchTerm = textSearch;
				}
			}
		});
	}
}

//execute when user click on items per page options 

/**
 * @description - Will set the active class for the item per page
 * @param {String} pageLimit - number for the page limit 
 */

function setActiveItem(pageLimit){
	$.each($('.paginationPages'), function() {
		$(this).removeClass("active");
	});	
	if(pageLimit === "10"){
		$("#10").addClass("active");
	}
	else if(pageLimit === "5"){
		$("#5").addClass("active");
	}
	else if(pageLimit === "25"){
		$("#25").addClass("active");
	}
	else if(pageLimit === "50"){
		$("#50").addClass("active");
	}	
}

//execute when user hits pagination

/**
 * @description - Execute when user clicks on the pagination and will set the active class accordingly and also call fetch the data accordingly
 * @param {String} name - name for the container 
 * @param {Number} totalResult - Number of total results for search word 
 */

function pagination(name,totalResult) {	
	var container = $('#pagination-' + name);	
	var searchParams = new URLSearchParams(window.location.search);
	var defaultOffset = searchParams.get("offset") || 0;	
	var setPageLimit = searchParams.get("noOfResPerPage") || itemPerPageLimit;
	var text = searchFinalText;
	var noOfResults = totalResult;
	var number = Math.ceil(noOfResults / setPageLimit);
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
				var offset = (pagination - 1) * setPageLimit ;
				$('.search-page-wrapper').addClass('search-display-none');
				$('.search-page-wrapper').removeClass('search-display-block');
				$('.pagination-wrapper').addClass('d-none');
				$('#shimmer-container-Search').removeClass('d-none');  
				window.scrollTo({ top: 100, behavior: 'smooth' });	 
				if (history.pushState) {
					var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q='+text+'&offset='+offset+'&noOfResPerPage='+itemPerPageLimit;
					window.history.pushState({path:newurl},'',newurl);
				}
				doAjaxSeach(text,itemPerPageLimit,offset,false,pagination); 
				var width  = $(window).width();    
				var searchBarDesktop = 1139;
				if(width < searchBarDesktop){
					var result = $('.search-nav-close-icon').hasClass('collapsed');
					if (!result) {
						$('.search-nav-close-icon').click();
					}
				}
				else{
					var hasShowClass = $('#searchNavCollapse').hasClass('show');
					if(hasShowClass){
						$('.showNavbar').click();
					}

				}
	
		},
		afterPageOnClick: function(data, pagination) {	
				var offset = (pagination - 1) * setPageLimit ; 				
				$('.search-page-wrapper').addClass('search-display-none');
				$('.search-page-wrapper').removeClass('search-display-block');
				$('.pagination-wrapper').addClass('d-none');
				$('#shimmer-container-Search').removeClass('d-none');
				window.scrollTo({ top: 100, behavior: 'smooth' });	
				if (history.pushState) {
					var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q='+text+'&offset='+offset+'&noOfResPerPage='+itemPerPageLimit;
					window.history.pushState({path:newurl},'',newurl);
				}	
				
				doAjaxSeach(text,itemPerPageLimit,offset,false,pagination);
				var width  = $(window).width();    
				var searchBarDesktop = 1139;
				if(width < searchBarDesktop){
					var result = $('.search-nav-close-icon').hasClass('collapsed');
					if (!result) {
						$('.search-nav-close-icon').click();
					}
				}
				else{
					var hasShowClass = $('#searchNavCollapse').hasClass('show');
					if(hasShowClass){
						$('.showNavbar').click();
					}					
				}

		},
		afterPreviousOnClick: function(data, pagination) {	
									
				var offset = (pagination - 1) * setPageLimit;
				$('.search-page-wrapper').addClass('search-display-none');
				$('.search-page-wrapper').removeClass('search-display-block');
				$('.pagination-wrapper').addClass('d-none');
				$('#shimmer-container-Search').removeClass('d-none');
				window.scrollTo({ top: 100, behavior: 'smooth' });	
				if (history.pushState) {
					var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q='+text+'&offset='+offset+'&noOfResPerPage='+itemPerPageLimit;
					window.history.pushState({path:newurl},'',newurl);
				}	
				
				doAjaxSeach(text,itemPerPageLimit,offset,false,pagination);
				var width  = $(window).width();    
				var searchBarDesktop = 1139;
				if(width < searchBarDesktop){
					var result = $('.search-nav-close-icon').hasClass('collapsed');
					if (!result) {
						$('.search-nav-close-icon').click();
					}
				}
				else{
					var hasShowClass = $('#searchNavCollapse').hasClass('show');
					if(hasShowClass){
						$('.showNavbar').click();
					}
				}

		},
		beforeNextOnClick: function(data, pagination) {		
				var offset = (pagination - 1) * setPageLimit ;
				$('.search-page-wrapper').addClass('search-display-none');
				$('.search-page-wrapper').removeClass('search-display-block');
				$('.pagination-wrapper').addClass('d-none');
				$('#shimmer-container-Search').removeClass('d-none');
				window.scrollTo({ top: 100, behavior: 'smooth' });	
				if (history.pushState) {
					var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q='+text+'&offset='+offset+'&noOfResPerPage='+itemPerPageLimit;
					window.history.pushState({path:newurl},'',newurl);
				}	
				
				doAjaxSeach(text,itemPerPageLimit,offset,false,pagination);
				var width  = $(window).width();    
				var searchBarDesktop = 1139;
				if(width < searchBarDesktop){
					var result = $('.search-nav-close-icon').hasClass('collapsed');
					if (!result) {
						$('.search-nav-close-icon').click();
					}
				}
				else{
					
					var hasShowClass = $('#searchNavCollapse').hasClass('show');
					if(hasShowClass){
						$('.showNavbar').click();
					}
				}
		}
	})
	
}

	  
	
		


	// $('.page-link').click(function(e) {
	// 	e.preventDefault();
	// 	var $form = $('#pl-search-form');
	// 	var input= $("<input>").attr("type", "hidden").attr("name", "offset").val($(this).data('offsetValue'));
	// 	$form.append($(input));
	// 	$form.submit();
	// });
	
	// $('#pl-search-form').submit(function(e) {
	//    // e.preventDefault();
	// });
	
	
