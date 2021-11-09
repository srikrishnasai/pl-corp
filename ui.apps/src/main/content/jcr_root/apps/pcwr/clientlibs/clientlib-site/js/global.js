if (typeof PacLife === "undefined") {
    var PacLife = {}
}

$(document).ready(function() {

	
	document.title = document.title + ' | Pacific Life ';

    // PLCOM-142: Logic to append .html & open Alt Fifty link in new tab
    $('.alt-fifty-link').each(function(index, element) {
		var target = $(element).attr('href');
	
		//Append html only if below criteria satisfied
		if (target && !target.includes('.pdf') && !target.includes('.com') && !target.includes('.org') && !target.includes('.html')) {
		    var newTarget = target + '.html';
		    $(element).attr('href', newTarget);
		}
    });

    // PLCOM-249
	$("#searchNavCollapse").on('shown.bs.collapse', function () {
        $('#inputSearchValue').focus();
        document.getElementById("inputSearchValue").value = "";
	});
    
	$(".touch-enabled-carousel").on("touchstart", function(event){
		var xClick = event.originalEvent.touches[0].pageX;
		$(this).one("touchmove", function(event){
			var xMove = event.originalEvent.touches[0].pageX;
			if( Math.floor(xClick - xMove) > 5 ){
				$(this).carousel('next');
			}
			else if( Math.floor(xClick - xMove) < -5 ){
				$(this).carousel('prev');
			}
		});
		$(".touch-enabled-carousel").on("touchend", function(){
			$(this).off("touchmove");
		});
	});
	
});

//PLCOM-359

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();


//Default-passive-events: https://zzarcon.github.io/default-passive-events/
!function (e) { "function" == typeof define && define.amd ? define(e) : e() }(function () { var e, t = ["scroll", "wheel", "touchstart", "touchmove", "touchenter", "touchend", "touchleave", "mouseout", "mouseleave", "mouseup", "mousedown", "mousemove", "mouseenter", "mousewheel", "mouseover"]; if (function () { var e = !1; try { var t = Object.defineProperty({}, "passive", { get: function () { e = !0 } }); window.addEventListener("test", null, t), window.removeEventListener("test", null, t) } catch (e) { } return e }()) { var n = EventTarget.prototype.addEventListener; e = n, EventTarget.prototype.addEventListener = function (n, o, r) { var i, s = "object" == typeof r && null !== r, u = s ? r.capture : r; (r = s ? function (e) { var t = Object.getOwnPropertyDescriptor(e, "passive"); return t && !0 !== t.writable && void 0 === t.set ? Object.assign({}, e) : e }(r) : {}).passive = void 0 !== (i = r.passive) ? i : -1 !== t.indexOf(n) && !0, r.capture = void 0 !== u && u, e.call(this, n, o, r) }, EventTarget.prototype.addEventListener._original = e } });
//# sourceMappingURL=index.umd.js.map

//Alt fix for default passive events
/*

jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.touchmove = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.wheel = {
    setup: function( _, ns, handle ){
        this.addEventListener("wheel", handle, { passive: true });
    }
};
jQuery.event.special.mousewheel = {
    setup: function( _, ns, handle ){
        this.addEventListener("mousewheel", handle, { passive: true });
    }
};

*/
