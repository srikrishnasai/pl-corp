$(function() {	     
    var width  = $(window).width();    
    var searchBarDesktop = 1139;
    
    if(width < searchBarDesktop){
        $( ".desktopNav" ).remove();        
    }    else {
        $( ".mobileNav" ).remove();   
    }


    $('.navTopToggle').click(function(e) {        
        var classExist = $('.search-nav-toggle-btn').is('.search-nav-toggle-btn', '.collapsed');            
        if(classExist ){                   
            $(".cmp-navigation__group").addClass('hideNavbar');
        }
    });    


    $('.showNavbar').click(function(e) {       
        var classExist = $('.search-nav-toggle-btn').is('.search-nav-toggle-btn');                               
        if(classExist ){                    
            $(".cmp-navigation__group").removeClass('hideNavbar');
        }
    });    
});