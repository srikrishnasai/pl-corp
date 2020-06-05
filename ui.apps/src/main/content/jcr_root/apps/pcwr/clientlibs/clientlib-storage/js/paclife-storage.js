PacLife.Storage = PacLife.Storage || {

    init : function() {
	this.sessionStorageSupported = false;

	try {
	    window.sessionStorage.setItem("testStore", "testStore");
	    window.sessionStorage.removeItem("testStore");
	    this.sessionStorageSupported = true
	} catch (a) {
	    this.sessionStorageSupported = false
	}

    },

    setSessionData : function(a, b) {
	if (this.sessionStorageSupported) {
	    window.sessionStorage.setItem(a, b)
	}
    },
    removeSessionData : function(a) {
	if (this.sessionStorageSupported) {
	    window.sessionStorage.removeItem(a)
	}
    },
    getSessionData : function(b) {
	var c = "";
	if (this.sessionStorageSupported) {
	    c = window.sessionStorage.getItem(b)
	} 
	return c;
    }
};
PacLife.Storage.init();