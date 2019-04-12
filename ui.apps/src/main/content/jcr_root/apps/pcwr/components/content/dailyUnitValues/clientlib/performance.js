$(document).ready(function() {
    onCorpPerfPageLoad();
});

var onCorpPerfPageLoad = function(){
	
	var tableDiv = $('#table-div-product')[0];
	
	if(!tableDiv)
		return;
	
	$.ajax({ 
	    type: 'GET', 
	    url: tableDiv.getAttribute('data-list-url'),
	    success: function (data) { 
	       $.each(data, function(index, element) {        
	            $('#select-perfproducts').append($("<option></option>").attr("value",element.Id).text(element.Name));             
	       });
	    }
	});
	
	var myht = $(".column").height();
	
	$(document).on('change', '#select-perfproducts', function(e) {
	    var productid = $('#select-perfproducts :selected').val();
	    if($.trim( productid ) ==''){
	       alert("Please select a product.");
	       return
	    }
	
	    $.ajax({ 
	        type: 'GET', 
	        url: tableDiv.getAttribute('data-info-url').replace(new RegExp("\{id\}", 'g'), productid),
	        success: function (data) { 

	        	$('#table-div-product').empty();
	            
	           var dateOfValues = new Date(data.DateOfValues).toLocaleDateString(
	        		   "en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	            
	            var content = "<p id='prdname'>" +  data.Name + "</p><table cellspacing='0' cellpadding='0' border='0'>"
	            content += "<tr id='toprow'><th class='td_l'>Variable Investment Option</th><th class='td_r'>" + dateOfValues + "</th></tr>";
	            
	            var fundType = '';
	            $.each(data.FundValue, function(index, element) {     
	                 if(fundType != element.FundType){
	                   fundType =element.FundType;
	                   content += '<tr id="ltblue" class="pcwr-unit-value-subheading"><td class="td_l">' + fundType  + '</td><td class="td_r">Unit Value</td></tr>';
	                  }
	                  content += '<tr><td class="td_l">' + element.Name + '</td><td class="td_r">' + element.Value +'</td></tr>';
	            });
	            content += "</table>"; 
	            $('#table-div-product').append(content);
	            $('tr:odd').addClass('odd');
	            $(".column").height(myht);
	            //var nht = myht + tableDiv.height();
	            //$(".column").equalHeights( nht );
	        }
	    });
	});
};



