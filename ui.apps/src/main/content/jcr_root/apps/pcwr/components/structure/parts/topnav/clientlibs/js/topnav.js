$(window).on('load', function () {
    $('.navbar-nav-header').addClass('fadein_navbar');
    $('.plcorp-mobile-menu-btn').addClass('animate-mobile-nav-button');
    $('.search-nav-toggle-btn').addClass('animate-mobile-nav-button');
    setTimeout(function(){

        $('.fadein_navbar').css('animation', 'none');
        $('.navbar-nav-header').css('opacity', '1');
    },500)
});

$(function() {	     
    var width  = $(window).width();    
    var searchBarDesktop = 1139;
    
    var searchArray = JSON.parse(localStorage.getItem('searchItems')) || [];
    
    if(searchArray.length > 5){
        searchArray.pop()
    }

    $('.searchItem').addClass('d-none');  

    $('.inputValueSearch').on('focus', function(){  
        $('.searchItem').removeClass('d-none');  
        var text = $('.inputValueSearch').val();
        if(!text){
            var searchItems='';   
            var searchItemsList = [];
        
            for(var i = 0; i<searchArray.length; i++){
                if(searchArray[i]) {
                    searchItems += 
                '<li data-item='+ searchArray[i] +' class="list-group-item search-group-item"><span data-item='+ searchArray[i] +' class="material-icons history-icon mr-2 ">history</span><span class="text-filter">' + searchArray[i] + '</span></li>'     
                }   
            }
           
            searchItemsList.unshift(searchItems);            
    
            
            $('.historySearchItems').empty();
            $('.historySearchItems').append(searchItemsList);
        }   
    });
    $('.inputValueSearch').on('input', function() {
        var text = $('.inputValueSearch').val();
        var filterArray = searchArray.filter(function(data){
            return data.indexOf(text) > -1; 
        });
    
        var searchItems='';   
        var searchItemsList = [];
    
        for(var i = 0; i<filterArray.length; i++){
            if(filterArray[i]) {
                searchItems += 
            '<li data-item='+ filterArray[i] +' class="list-group-item search-group-item"><span data-item='+ filterArray[i] +' class="material-icons history-icon mr-2 ">history</span><span class="text-filter">' + filterArray[i] + '</span></li>'     
            }
        }
       
        searchItemsList.unshift(searchItems);            
        $('.historySearchItems').empty();
	    $('.historySearchItems').append(searchItemsList);
    });

    // $('showNavbar').click(function(){        
    //     $('.searchItem').addClass('d-none');  
    //     $('.historySearchItems').empty();        
    // });

    $('.searchItem').click(function(e){                
        if(e.target.firstChild.nextElementSibling){
            document.getElementById('inputSearchValue').value = e.target.firstChild.nextElementSibling.innerHTML;    
        } else if(e.target.nextSibling) {
            document.getElementById('inputSearchValue').value = e.target.nextSibling.innerHTML;
        }  else {
            document.getElementById('inputSearchValue').value = e.target.innerHTML;
        }      
        $('.searchItem').addClass('d-none');
    });

	$('.searchSubmit').click(function(e){
		var searchText = document.getElementById('inputSearchValue').value.toLowerCase();								
		if(searchArray.indexOf(searchText) === -1 ){
			searchArray.unshift(searchText);
			localStorage.setItem('searchItems', JSON.stringify(searchArray));										
        }       
    });


    $('.searchSubmit-mb').click(function(e){
		var searchText = document.getElementById('inputSearchValue').value.toLowerCase();								
		if(searchArray.indexOf(searchText) === -1 ){
			searchArray.unshift(searchText);
			localStorage.setItem('searchItems', JSON.stringify(searchArray));										
        }       
    });

    if(width < searchBarDesktop){
        $( ".desktopNav" ).remove();        
    }    else {
        $( ".mobileNav" ).remove();   
    }
    $('.navTopToggle').click(function(e) {        
  
        var classExist = $('.search-nav-toggle-btn').is('.search-nav-toggle-btn', '.collapsed');            
        if(classExist){                   
            $(".cmp-navigation__group").addClass('hideNavbar');
            $("#searchNavCollapse.desktopNav").removeClass('close-container');
            $("#searchNavCollapse.desktopNav").addClass('open-container');
        }
    });    
    $('.showNavbar').click(function(e) {  
        var classExist = $('.search-nav-toggle-btn').is('.search-nav-toggle-btn');                              
        if(classExist){   
            $("#searchNavCollapse.desktopNav").addClass('close-container');
            setTimeout(function() {
                $("#searchNavCollapse.desktopNav").removeClass('open-container');
            }, 600);
            $(".cmp-navigation__group").removeClass('hideNavbar');
                             
        }
        $('.inputValueSearch').val('');                
        $('.searchItem').addClass('d-none');  
        $('.historySearchItems').empty(); 
    });
    $('.plcorp-mobile-menu-btn').click(function(e) {    
        var classExistForClose = $('.plcorp-mobile-menu-btn').is('.collapsed');           
        if(classExistForClose){  
            $("body,html").addClass('overflow-body-class'); 
            $(".topnav").addClass('height-navbar'); 
        }
        else{
            $("body,html").removeClass('overflow-body-class');  
            $(".topnav").removeClass('height-navbar');                          
        }
    });  
    $('.search-nav-close-icon').click(function (e) { 
        $("body,html").removeClass('overflow-body-class');       
    });
    $('.search-nav-toggle-btn').click(function (e) { 
        $("body,html").removeClass('overflow-body-class'); 
        $('html, body').animate({scrollTop:0}, '300');
    });

    $('.search-nav-toggle-btn ').click(function (e) { 
        console.log("open");
        $("#searchNavCollapse.mobileNav").addClass('open-container');
    });
    $('.search-nav-close-icon').click(function (e) { 
        console.log("Closed");
        $("#searchNavCollapse.mobileNav").removeClass('open-container');
        
    });
    
});
