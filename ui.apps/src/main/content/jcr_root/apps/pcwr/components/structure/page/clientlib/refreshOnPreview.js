(function ($, $document) {  
  
    // Adding action on layer  
    $document.on('cq-layer-activated', refreshPage);  
  
    function refreshPage(ev) {  
        try {  
            // Get edit mode page iframe reference  
            var iframe = document.getElementById('ContentFrame');  
            var innerDoc = iframe.contentDocument || iframe.contentWindow.document;  
  
            // Refresh only if both layers are different and they are either 'Preview' or 'Edit'  
            if ((ev.prevLayer === "Preview" && ev.layer === "Edit") || (ev.prevLayer === "Edit" && ev.layer === "Preview")) {  
                window.location.reload();  
  
            }  
  
        } catch (e) {  
            console.log("Error occurred while refreshing the page");  
        }  
    }  
}(jQuery, jQuery(document)));  