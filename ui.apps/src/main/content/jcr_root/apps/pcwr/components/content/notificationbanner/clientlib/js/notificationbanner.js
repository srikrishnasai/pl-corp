$(document).ready(function() {
    $(".notification_bar").each(function(){
		var bannerPosition = $(this).attr("data-banner-position");
  		var sticky = $(this).attr("data-is-sticky");
        if(bannerPosition != 'none'){
            // $(this).css("opacity" ,"0");
    	    setCSSProperties(bannerPosition , this);
        }
    })
    var readCookie = localStorage.getItem("notificationBanner");
    if($(".cookienotification").attr("data-banner-type") === 'cookienotification'){
        if (typeof(readCookie) != 'undefined' && readCookie != null) {
            var cookieValue = JSON.parse(readCookie);
            if(new Date().getTime() > cookieValue.expires){
                localStorage.removeItem("notificationBanner");               
                }
                else{
                    $(".cookienotification").css("display","none");
                    var bannerPosition = $(".cookienotification").attr("data-banner-position");
    				if(bannerPosition === "bottom"){
                        document.body.style.marginBottom = "0px";
                    }
                        else{
                            document.body.style.marginTop = "0px";
                    }
                }
        }
        else{
            localStorage.removeItem("notificationBanner");
        }
    }
});

function setCookieBanner(curElem) {
    localStorage.removeItem("notificationBanner");
    var cookieExpiry = $(curElem).parent().attr("data-cookie-expiry");
    var object = {expires: new Date().getTime() + cookieExpiry * 24 * 60 * 60 * 1000}
	localStorage.setItem("notificationBanner", JSON.stringify(object));
	$(curElem).parent().css("display","none");
    var bannerPosition = $(curElem).parent().attr("data-banner-position");
    if(bannerPosition === "bottom"){
    document.body.style.marginBottom = "0px";
    }
    else{
		document.body.style.marginTop = "0px";
    }

}

function setBannerType(curElem){
	var bannerType = $(curElem).parent().attr("data-banner-type");
    if(bannerType === 'cookienotification'){
		setCookieBanner(curElem);
    }
    if(bannerType === 'normalnotification'){
		var targetPath = $(curElem).attr("data-path");
        var targetTab = $(curElem).attr("data-path-tab");
        var buttonType = $(curElem).attr("data-button-type");
        var bannerPosition = $(curElem).parent().attr("data-banner-position");

		if(bannerPosition === "bottom"){
        document.body.style.marginBottom = "0px";
        }
        else{
            document.body.style.marginTop = "0px";
        }

        if(buttonType === "linkButton"){
        	if(targetTab === "true"){
				window.open(targetPath + ".html",'_blank');
            }else{
				window.location.href = targetPath + ".html";
            }
        }
        else{
            $(curElem).parent().css("display","none");
        }

    }
}

function setCSSProperties(bannerPosition,elem){
	var notificationBar = $(elem)
    if(bannerPosition === 'bottom'){
        if($("#wcmmmode").attr("data-wcm-mode") !== 'EDIT' && $("#wcmmmode").attr("data-wcm-mode") !== 'edit' ){
            document.body.style.marginBottom = notificationBar.innerHeight() + "px";
        }
        notificationBar.css("bottom", "0");
        notificationBar.css("z-index", "1000");
        notificationBar.addClass('show-banner');

        // notificationBar.css("opacity" ,"1");
        notificationBar.css("position" ,"fixed");
    } 
    if(bannerPosition === 'top'){
        if($("#wcmmmode").attr("data-wcm-mode") !== 'EDIT' && $("#wcmmmode").attr("data-wcm-mode") !== 'edit' ){
            document.body.style.marginTop = notificationBar.innerHeight() + "px";
        }
       
        notificationBar.css("top", "0");
        notificationBar.css("z-index", "1000");
        notificationBar.addClass('show-banner');
        // notificationBar.css("opacity" ,"1");
        notificationBar.css("position" ,"fixed");
	} 
} 