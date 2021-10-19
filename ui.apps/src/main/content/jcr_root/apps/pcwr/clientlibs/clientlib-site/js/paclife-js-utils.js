PacLife.JSUtils = PacLife.JSUtils || {
    removeAnimationClassNames : function($elem, prefix) {
        if($elem && $elem.length > 0) {
            const $el = $elem[0];
            for(var i = $el.classList.length - 1; i >= 0; i--) {
                if($el.classList[i].startsWith(prefix)) {
                    $el.classList.remove($el.classList[i]);
                }
            }
        }
    }
};
