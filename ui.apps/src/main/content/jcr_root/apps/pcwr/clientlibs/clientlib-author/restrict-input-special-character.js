(function($) {
    "use strict";
    var registry = $(window).adaptTo("foundation-registry");
    registry.register("foundation.validation.validator", {
        selector: "[data-validation=special-character-validation]",
        validate: function(element) {
            let el = $(element);
            let pattern=/^[0-9\,\.]+$/;
            let value=el.val();
            if(!pattern.test(value)){
               return "Only Number, Comma, or Dot allowed";
            }

        }
    });

})(jQuery);