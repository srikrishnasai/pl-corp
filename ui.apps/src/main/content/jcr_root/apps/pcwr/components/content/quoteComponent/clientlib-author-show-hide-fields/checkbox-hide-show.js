
(function (document, $) {
    "use strict";
    $(document).on("foundation-contentloaded", function (e) {
        checkboxShowHideHandler($(".cq-dialog-checkbox-hideshow", e.target));
    });

    $(document).on("change", ".cq-dialog-checkbox-hideshow", function (e) {
        checkboxShowHideHandler($(this));
    });
    function checkboxShowHideHandler(el) {
        el.each(function (i, element) {
            if($(element).is("coral-checkbox")) {
                Coral.commons.ready(element, function (component) {
                    showHide(component, element);
                    component.on("change", function () {
                        showHide(component, element);
                    });
                });
            } else {
                var component = $(element).data("checkbox");
                if (component) {
                    showHide(component, element);
                }
            }
        })
    }
    function showHide(component, element) {
        var target = $(element).data("cqDialogCheckboxHideShowTarget");
        var $target = $(target);
        if (target) {
            $target.hide();
            if (component.checked) {
                $target.show();
            }
        }
    }
})(document, Granite.$);