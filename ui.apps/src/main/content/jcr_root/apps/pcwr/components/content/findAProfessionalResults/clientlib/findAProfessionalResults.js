if($('.find-a-pro-results-page').length > 0) {
	
	google.maps.event.addDomListener(window, 'load', initialize);

	var options;
	var mapContainer;
	var $mapContainerEl;
	var map;
	var $inputLocation;
	var address;
	var marker;
	var zlevel = 12;
	var centerLocation = "";
	var allMarkers = [];
	var advMarker;
	var infoboxes = [];
	var pageno = 1;
	var bounds = new google.maps.LatLngBounds();
	var autocomplete;
	var loadingGif ="<div id='find'><img src='/etc/designs/pcwr/default/images/throbber_13.gif' width='32' height='32' /><br><br><span>Searching. . . </span></div>";
	var noAdvisorsFoundMsg = "There were no advisors found in your area. Please enter a different Zip Code and try again.";
	var systemError = "System maintenance is being performed. Please try again later.";
	var srvcerr = "System maintenance is currently being performed. Please try again later.";
	//hide points of interest
	var noPoi = [
	{
	    featureType: "poi",
	    stylers: [
	      { visibility: "off" }
	    ]   
	  }
	];

	var geo_options = {
		// enableHighAccuracy: true,
		maximumAge : 300000,
		timeout : 10000
	};

	function initialize() {
		
		$inputLocation = $('#fafp-inputSearchValue');
		$mapContainerEl = $('#map-container');
		// Initialize map.
		options = {
			center : new google.maps.LatLng(41, -95),
			zoom : 4,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			types : [ 'geocode' ],
			mapTypeControl : false,
			componentRestrictions : {country : "us"},
			styles : noPoi,
			streetViewControl : false
		};
		
		//Check if URL contains Zip code
		var urlZipCode = $('#fafp-url-zip-code').val();
		
		if(urlZipCode) {
			getCoordinatesFromZipCode(urlZipCode);	
		}
		else {			
			// If URL does not have zip code OR it is invalid, get location from browser
			geoLocation();
		}
	}

	// Read Browser/device location
	function geoLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition( geo_success, geo_error, geo_options );
		}
	}

	/* After getting Browser/device location: 
	 * 1. Call Geocoding service and set current address (City, State) in the Input Field
	 * 2. Center Map and set Marker based on the coordinates 
	 * 3. (Pass coordinates to and) Call PacLife webserice to get list of all financial professionals based on coordinates */	
	function geo_success(position) {
		
		//Call to Paclife webservice
		setLocation(position.coords.latitude, position.coords.longitude);		
	}
	
	function showMap(lat, lon) {
		
		$("#map-container p").remove();
		
		var dateTime  = new Date();

		mapContainer = document.getElementById('map-container');
		map = new google.maps.Map(mapContainer, options);
		marker = new google.maps.Marker();
		google.maps.event.addListener(marker, 'click', function() {
		    map.setCenter(marker.getPosition());
		    map.setZoom(zlevel - 1);
		    closeInfo();
		    clearlist();
		  });

		var coords = new google.maps.LatLng(lat, lon);
		var geocoder = new google.maps.Geocoder();
		
		////Get location from Geocode service and Populate address in the Input field
		geocoder.geocode({'latLng': coords}, function(results, status) {
	
			if (status == google.maps.GeocoderStatus.OK) {
				
				var result = results[0];
				// look for locality tag and administrative_area_level_1
				var geoZip = "";
				for (var i = 0, len = result.address_components.length; i < len; i++) {
					var ac = result.address_components[i];
					if (ac.types.indexOf("postal_code") >= 0)
						geoZip = ac.long_name;
				}


				if(geoZip != '') {
					$inputLocation.val( geoZip );
					$("label[for='fafp-inputSearchValue']").html(geoZip);
					address = geoZip;
		        }
			}
			
			marker.setTitle(address);		
		});

		map.setCenter(coords);
		map.setZoom(zlevel);
		marker.setMap(map);
		marker.setPosition(coords);

		centerLocation = coords
		
	}

	// Call to Paclife webservice to get list of advisors
	function setLocation(lat, long) {
	    var date = new Date();
	    var time = date.getTime();
	    
	    $(".container-search-items").empty();
	    $("#holder").empty();
	    $("#find").remove();
	    
	    $mapContainerEl.prepend( loadingGif );
	    
	    var query = $inputLocation.val();
	    if(query == '') {
	    	query ='DEFAULT';
	    }
	    	
	    var url = $('#fafp-webservice-url').val() ? $('#fafp-webservice-url').val() + "?" : "/bin/findadvisor/geolocation?";  
		if( location.href.indexOf('mobile') != -1 ){ 
			var locURL = url + "latitude=" + lat + "&longitude=" + long+"&query=" +query+"&mobile=true"+"&time="+time;
		} else {
	    	var locURL = url + "latitude=" + lat + "&longitude=" + long+"&query=" +query+"&time="+time;
		}
		
		$.get( locURL, function(data) {
	    	showMap(lat, long);
	        markerList(data);
	    })
	    .done(function() {
	    	$("#find").remove();
	    })
	    .fail(function() {
	    	$("#find").remove();
	    	displayMessage( srvcerr );
	    });	    
	}

	// display search results
	function markerList(data) { 
		
		if(data == null || typeof data === "undefined"){
	    	displayMessage(systemError);
	        return;
	    }

		// analytics
		window.digitalData.page.onsiteSearchResult = data.length;
		window.digitalData.page.onsiteSearchTerm = $("#fafp-inputSearchValue").val() || $("#fafp-url-zip-code").val() || 'Current Location';
		
		if (typeof _satellite != "undefined") {
			_satellite.track('find-a-pro-results');
		}
		
		if(data != null && data.length == 0 ){
			displayMessage(noAdvisorsFoundMsg);
	        return;
	    }
		
		advMarker = "";
	    allMarkers = [];
	    var resultItemList = [];
	    
	    clearMarkers(null);
	    
	    var oldpos;   
	    var oldcontent;
	    //Parse data
	    $(data).each(function( i ) {
	    	
	        var fullName = this.firstName + " " + this.lastName;
	        var mpos = new google.maps.LatLng( this.latitude, this.longitude );

	        var dist = parseFloat(this.distance).toFixed(1);
	        
	        var ph = formatPhoneNumber(this.phoneNo);
	        
	        var phoneHtml = getPhoneDisplayHtml(ph);
	        var businessName = formatBusinessName(this.firmName);
	        
	        var mapInfoBoxContent = getMapInfoBoxContent(this, fullName, businessName, phoneHtml);
	       
	       	//min and max limits for multiplier, for random numbers
	        //keep the range pretty small, so markers are kept close by
	        var min = .999999;
	        var max = 1.000001;

	        //check marker position
	        if (i > 1 && oldpos.equals(mpos)) {
	            var newLat = mpos.lat() * (Math.random() * (max - min) + min);
	            var newLng = mpos.lng() * (Math.random() * (max - min) + min);

	            mpos = new google.maps.LatLng(newLat,newLng);
	        }
	        
	        oldpos = mpos;
	        
	        advMarker = new google.maps.Marker({
	            icon: 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',
	            //position: new google.maps.LatLng( this.latitude, this.longitude ),
	            position: mpos,
	            map: map,
	            visible: true,
	            title: fullName
	            });
	        
	        //set advMarker ID
	        advMarker.set("id", i );
	        advMarker.set("distance", this.distance );
	        
	        //save all markers
	        allMarkers.push(advMarker);
	        
	        var infowindow = new google.maps.InfoWindow();
	        infoboxes.push(infowindow); 
	        
	        var resultItemHtml = getResultItemHtml(this, businessName, phoneHtml, dist, i);
	        resultItemList.push(resultItemHtml);
	        
	        addMarkerListenerForResultItem(advMarker, i, infowindow, mapInfoBoxContent);
	    });
	    
	    $('.container-search-items').empty();
	    $('.container-search-items').append(resultItemList.join(''));
	    
	    registerResultItemClickEvent();
	    
        /* pagination - initiate plugin */
        jpage();
        
        appendMaterialIcons();

        showMarkers(0);
        
        //reset pnum
        pnum = 0;
        
        //pagination
        $("#holder a").click(function() {
            showMarkers( $(this).text() );			
        });
	}
	
	function showMarkers(num) {
		closeInfo();
	    //reset bounds
	    bounds = new google.maps.LatLngBounds(null);
	    
	    var upperlimit = Math.ceil(allMarkers.length/5)*5;
	    
	    //hide markers
	    for(i = 0; i < allMarkers.length; i++) {
	        allMarkers[i].setVisible(false);
	    }
	    
	    if(num === "keyboard_arrow_leftprevious"){ 
	        if(pnum > 5){ 
	            pnum = pnum - 5;
	            num = pnum - 5;
	        } else if(pnum === 5 || num === "keyboard_arrow_leftprevious") {
	            num = 0;
	            pnum = 5;
	        }
			pageno = pnum/5;

		} else if(num === "nextkeyboard_arrow_right"){
	        if(pnum < 50){ 
	            if(pnum === upperlimit){
	                pnum = upperlimit;
	                num = upperlimit - 5;
	            } else if(pnum === 0){
					num = 5;
					pnum = 10;
				} else {
	                pnum = pnum + 5;
	                num = pnum - 5; 
	            }
	            
	        } else if(pnum === 50) {
	            num = 45;
	            pnum = 50;
	        } 
			pageno = pnum/5;
	    } else if(num === 0){
	        num = 0;
	        pnum = 5;       
	    } else if(num > 0){
	        pnum = num * 5;
	        num = pnum - 5;
			pageno = (num/5)+1;
	    }
	    
	    for(var j = num; j < pnum && j < allMarkers.length; j++) {
	        allMarkers[j].setVisible(true);
	        bounds.extend( allMarkers[j].position );
	        resize();
	    }
	    
	    //populate radius
	    $("#radius").html("We have located " + allMarkers.length + " advisors within a " + allMarkers[allMarkers.length - 1].distance.toFixed(1) + " mile radius of " + $inputLocation.val());
	}

	function resize(){
	      bounds.extend( centerLocation );
	      map.fitBounds(bounds);
	      //map.setCenter( centerloc );
	      map.panToBounds(bounds);
	      zlevel = map.getZoom();
	      clearlist();
	}
	
	function jpage() {
		$("#holder").jPages({
	        containerID : "resultlist",
	        perPage : 5,
	        previous    : "previous",
	        next        : "next"
	    });
	}
	
	function appendMaterialIcons() {
		$('.jp-previous').prepend('<i class="material-icons">keyboard_arrow_left</i>');
		$('.jp-next').append('<i class="material-icons">keyboard_arrow_right</i>');
	}
	
	function registerResultItemClickEvent() {
		$('.container-search-items div').click(function() {
			var mid = this.id.substr(12);
            $(allMarkers).each(function( i ) {
                if(allMarkers[i].id == mid){
                        google.maps.event.trigger(allMarkers[i], 'click');
                }               
            });
		});
	}
	
	function addMarkerListenerForResultItem(advMarker, i, infowindow, mapInfoBoxContent) {
		
		 //Marker listener to highlight resultlist item
        google.maps.event.addListener(advMarker, 'click', (function(advMarker, i, infowindow, mapInfoBoxContent) {
          return function() {
               clearlist();
               
              var pid = "#result-item-" + advMarker.get("id");
              $( pid ).css({"background-color":"#CDF4FA","color":"#333"});
              closeInfo();
              infowindow.setContent(mapInfoBoxContent);
              infowindow.open(map, advMarker);
            }
          })(advMarker, i, infowindow, mapInfoBoxContent));
	}
	
	function getResultItemHtml(obj, businessName, phoneHtml, dist, i) {
		var itemId = "result-item-" + i;
		var resultItem = 	"<div id='" + itemId + "' class='search-result'>"	+
							"<h6>"+ obj.firstName + " " + obj.lastName + "</h6>"	+
							"<p class='p-alt-16'><strong>" + businessName + "</strong></p>" 	+
							"<p class='p-alt-16'>" + obj.businessLine1 + "<p>" +
							"<p class='p-alt-16'>" + obj.businessCity + ", " + obj.businessState + " " + obj.businessZip + "<p>"	+
							phoneHtml +
							"<p class='p-alt-16'><strong>Offers: </strong>"+ obj.productFamily + "<p>"	+
							"<p class='p-alt-16'><strong>Distance: </strong>"+ dist + " miles<p>"	+
							"</div>";		
		return resultItem;
	}
	
	function getMapInfoBoxContent(obj, fullName, businessName, phoneHtml) {
		
        var content = '<div id="infobox"><div><b>' + fullName + '</b></div>' + businessName
        + obj.businessLine1 + '<br>'
        + obj.businessCity + ', ' + obj.businessState + ' ' + obj.businessZip + '<br><br>' 
        + phoneHtml 
		+ "<br><b>Offers:</b> " + obj.productFamily
		+ '</div>';
        
        return content;
	}
	
	function formatPhoneNumber(phoneNo) {
		var ph = '';
		if(phoneNo && phoneNo.indexOf('-') < 0 ) {
        	ph = phoneNo.substr(0, 3) + '-' + phoneNo.substr(3, 3) + '-' + phoneNo.substr(6,4);
		} else {
			ph = phoneNo;
		}	
		return ph;
	}
	
	function getPhoneDisplayHtml(ph) {
		var phoneHtml;
		
		if(location.href.indexOf('/mobile') != -1){	
			phoneHtml = '<span><b>Phone: </b> <a href="tel:' + ph + '\">' + ph + '</a></span>';
			//phoneHtml = "<p class='p-alt-16 mt-3'><strong>Phone:</strong><a href='tel:'" + ph + "</p>";
		} else {
			phoneHtml = "<p class='p-alt-16 mt-3'><strong>Phone: </strong>" + ph + "</p>";
		} 
		return phoneHtml;
	}
	
	function formatBusinessName(firmName) {
		 var businessName = '';
		if(firmName== null || firmName=='NULL' || firmName==' ' || firmName.length<=0 ){
			businessName = '';
		} else {
			businessName = '<i>' + firmName + '</i><br>';
		}
		
		return businessName;
	}
	
	//Clear all markers on the map
	function clearMarkers(map) {
		for (var i = 0; i < allMarkers.length; i++) {
		    allMarkers[i].setMap(map);
	  	}
	}
	
	function closeInfo() {
		  for (var k=0;k<infoboxes.length;k++) {
		     infoboxes[k].close();
		  }
		}
	
	function clearlist(){
	     $("[id^=result-item]").css({"background-color":"#ffffff","color":"#666"});
	}
	function displayMessage(msg) {
		$(".container-search-items").empty();
	    $("#holder").empty();
	    
	    $('#fafp-error-msg').toggleClass('d-none');
	    $('#fafp-error-msg .col').text(msg);
	}
	
	function hideErrorMessage() {
		$('#fafp-error-msg').addClass('d-none');
	}
	function geo_error() {
		//Leave blank
	}
	
	/* On FAFP Results page --> When user enters Zip Code and clicks CTA: 
	 * 
	 *  If Zip code is not blank --> Call Geocoding service to get coordinates
	 * */
	$('#fafp-zip-code-button').click(function(event) {
		event.preventDefault();
		var zipCode = $inputLocation.val();
		if(zipCode) {
			$mapContainerEl.html("");
			getCoordinatesFromZipCode(zipCode);			
		}
		
	});
	
	/* Code to get Co-ordinates from Zip Code
	 * 
	 *  If coords valid --> Call setLocation()
	 * */
    
	function getCoordinatesFromZipCode(zipCode) {
		
		var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 
            componentRestrictions: {
                  country: 'US',
                  postalCode: zipCode
            }
        }, function(results, status) {

		//geocoder.geocode({'address': zipCode}, function(results, status) {
            
			if (status == google.maps.GeocoderStatus.OK) {

				var result = results[0];
				var coords = new google.maps.LatLng(result.geometry.location.lat(), result.geometry.location.lng());
				var geoZip = "";
				
                for (var i = 0, len = result.address_components.length; i < len; i++) {
					var ac = result.address_components[i];  

                   // console.log(ac.long_name);

					if (ac.types.indexOf("postal_code") >= 0)
						geoZip = ac.long_name;
				}
                
				if(geoZip != '') {
					$inputLocation.val( geoZip );
					$("label[for='fafp-inputSearchValue']").html(geoZip);
					address = geoZip;
		        }

				setLocation(coords.lat(), coords.lng());
				//return coords;
			}
			
		});
	}
	function geoCodeService() {}
}



/*	Code to Google auto complete feature. Call this method from initialize() if you want to enable
 * this feature
 * function initializeAutoComplete() {
	 var inputField = document.getElementById('fafp-inputSearchValue');
	 autocomplete = new google.maps.places.Autocomplete(inputField, options);
	 
	  google.maps.event.addListener(autocomplete, 'place_changed', function() {
			    var place = autocomplete.getPlace();
			    if (place.geometry) {
			      var location = place.geometry.location;
			      map.panTo(location);
			      map.setZoom(zlevel);
			      map.setOptions({styles: noPoi});
			      marker.setMap(map);
			      marker.setPosition(location);
			      marker.setTitle( $inputLocation.val() );
			      //marker.setIcon(redstar);
			      var autolat = place.geometry.location.lat();
			      var autolong = place.geometry.location.lng();
			      setLocation( autolat, autolong );
			      clearMarkers(null);
			      centerLocation = location;
			      $("#radius").empty();
			    }
			  });
	 
}*/

